const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const _ = require('lodash')

const User = require('../models/User')
const Pdfs = require('../models/Pdfs')
const Colleges = require('../models/Colleges')
const { templateSettings } = require('lodash')
const dateString = require('../public/js/date')

// @desc    dashboard of the respective college
// @route   GET /dashboard/
router.get('/', ensureAuth , async (req,res)=>{
  req.params.college = req.user.collegeName;
  const authorProfile = await User.findById(req.user.id)

    const arr = [];
    await Colleges.findOne({collegeName: req.user.collegeName})
    .populate('topPerformer')
    .exec(async (err, foundCollege) => {
        if(err) {
            console.log(err);
        }
        else {
            if(foundCollege !== null) {
                const len = foundCollege.topPerformer.length;
                
                for(let i=0; i<len && i<5; ++i) {
                    let profile = {
                        "name": foundCollege.topPerformer[i].displayName,
                        "id": foundCollege.topPerformer[i]._id,
                        "pdfLength": foundCollege.topPerformer[i].pdfs.length
                    };
                    arr.push(profile);
                
                }
            }
        }
        
        res.render("dashboard", {
            college : req.user.collegeName,
            authorProfile : authorProfile,
            arr: arr
          })
    })
})



// @desc    
// @route   GET /dashboard/year/branch
router.get('/:year/:branch', ensureAuth, async (req, res) => {

  const year = req.params.year
  const branch = req.params.branch
  const college = req.user.collegeName
  const authorProfile = await User.findById(req.user.id)
  var result = branch.replace( /([A-Z])/g, " $1" );
  var branch_sliced = result.charAt(0).toUpperCase() + result.slice(1);
  const br = `All Branches`

  if (year === '1') {
    try {
      const pdfs = await Pdfs.find({ college: college, year: year });

      res.render("category", {
        branch_sliced: branch_sliced,
        college: college,
        year: year,
        branch: branch,
        pdfs: pdfs,
        authorProfile: authorProfile
      })

    } catch (err) {
      console.log(err)

    }

  } else {

    try {
      const pdfs = await Pdfs.find({ college: college, year: year, branch: branch });

      res.render("category", {
        branch_sliced : branch_sliced,
        college : college,
        branch: branch,      
        year : year,
        pdfs : pdfs,
        authorProfile: authorProfile
      })

    } catch (err) {
      console.log(err)

    }
  }

})



// Like feature
router.post('/like/:pdfId', async (req, res) => {
  try {
    const pdfId = req.body.pdfId
    const currUser = req.user.id;
    await Pdfs.findOne({ _id: pdfId }, (err, foundPdf) => {
      if (err) {
        console.log(err);
      }
      else {
        const currLen = foundPdf.upvotes.length
        var newLen = currLen
        if (foundPdf.upvotes.indexOf(currUser) === -1) {
          foundPdf.upvotes.push(currUser)
          newLen++;
        }
        else {
          const index = foundPdf.upvotes.indexOf(currUser);
          foundPdf.upvotes.splice(index, 1);
          newLen--;
        }
        foundPdf.save((err) => {
          console.log(err);
        });
        const upvoteStatus = (newLen > currLen) ? true : false;
        res.send({ upvoteCount: foundPdf.upvotes.length, upvoteStatus: upvoteStatus })
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//To upload the file
router.post('/', ensureAuth, async (req, res) => {
  try {
    const driveUrl = req.body.driveUrl
    const title = req.body.title
    const year = req.body.year
    const branch = _.camelCase(req.body.branch)
    const dateStr = dateString()
    const pdf = new Pdfs({
      title: title,
      driveUrl: driveUrl,
      college: req.user.collegeName,
      year: year,
      branch: branch,
      user: req.user.id,
      userName: req.user.firstName,
      createdAt: dateStr
    })

    await pdf.save((err) => {
      console.log(err);
    })

    req.user.pdfs.push(pdf)

    await req.user.save((err)=>{
      console.log(err)
    })

    const collegeName = req.user.collegeName
    await Colleges.findOne({collegeName: collegeName}, async (err, foundCollege) => {
        if(err) {
            console.log(err);
        }
        else {
            const userId = req.user.id;
            if(foundCollege === null) {
                const college = new Colleges({
                    collegeName: collegeName
                })
                college.topPerformer.push(userId);
                console.log("new college schema topPerformer: " + college.topPerformer);
                await college.save((err) => {
                    console.log(err);
                })
            }
            else {
                const idx = foundCollege.topPerformer.indexOf(userId);
                if(idx === -1) {
                    foundCollege.topPerformer.push(userId);
                }
                await foundCollege.save((err) => {
                    console.log(err);
                })
            }
        }
    })
    
    await Colleges.findOne({collegeName: collegeName})
    .populate('topPerformer')
    .exec(async (err, foundCollege) => {
        if(err) {
            console.log(err);
        }
        else {
            foundCollege.topPerformer.sort((a, b) => b.pdfs.length - a.pdfs.length);
            await foundCollege.save((err) => {
                console.log(err);
            })
        }
    })

    // res.redirect('/dashboard')
    res.send({status: "success"});
  } catch (err) {
    console.log(err)

  }

})


//=================Search routing====================================

router.post("/search/:year/:branch", async (req, res) => {
    const authorProfile = await User.findById(req.user.id);
    const searchQuery = req.body.searchQuery;
    const year = req.params.year
    const branch = req.params.branch
    const college = req.user.collegeName
    var result = branch.replace( /([A-Z])/g, " $1" );
    var branch_sliced = result.charAt(0).toUpperCase() + result.slice(1);
    // console.log(searchQuery);

    if(year === "1") {
        await Pdfs.find({title: {$regex: `${searchQuery}`, $options: 'i'}, year: year, college: college}, (err, foundPdf) => {
            if(err) {
                console.log(err);
            }
            else {
                res.render("search", {
                    branch_sliced : branch_sliced,
                    college : college,
                    branch: branch,      
                    year : year,
                    searchQuery: searchQuery,
                    pdfs : foundPdf,
                    authorProfile: authorProfile
                });
            }
        });
    }
    else {
        await Pdfs.find({title: {$regex: `${searchQuery}`, $options: 'i'}, year: year, branch: branch, college: college}, (err, foundPdf) => {
            if(err) {
                console.log(err);
            }
            else {
                // console.log(foundPdf);
                res.render("search", {
                    branch_sliced : branch_sliced,
                    college : college,
                    branch: branch,      
                    year : year,
                    searchQuery: searchQuery,
                    pdfs : foundPdf,
                    authorProfile: authorProfile
                });
            }
        })
    }
    
})




module.exports = router
