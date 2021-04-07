const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const _ = require('lodash')

const User = require('../models/User')
const Pdfs = require('../models/Pdfs')
const Colleges = require('../models/Colleges')
const { templateSettings } = require('lodash')

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
                
                for(let i=0; i<len && i<3; ++i) {
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
  // console.log(branch_sliced)
  // console.log(branch)

  if (year === '1') {
    try {
      const pdfs = await Pdfs.find({ college: college, year: year });

      // pdfs.forEach((pdf) => {
      //   console.log(pdf.user.firstName)
      // })

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
router.post('/:year/:branch', async (req, res) => {
  try {
    const userId = req.body.id
    const title = req.body.title
    await Pdfs.findOne({ user: userId, title: title }, (err, foundPdf) => {
      if (err) {
        console.log(err);
      }
      else {
        const currUser = req.user.id;
        if (foundPdf.upvotes.indexOf(currUser) === -1) {
          foundPdf.upvotes.push(req.user.id)
        }
        else {
          index = foundPdf.upvotes.indexOf(currUser);
          foundPdf.upvotes.splice(index, 1);
        }
        foundPdf.save((err) => {
          console.log(err);
        });
        res.send({ upvoteCount: foundPdf.upvotes.length })
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
    const date = new Date();
    const dateStr = date.toLocaleString(undefined, { timeZone: 'Asia/Kolkata' }).split(",")[0]
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

    const profile = await User.findById(req.user.id)
    profile.pdfs.push(pdf)

    await profile.save((err)=>{
      console.log(err)
    })
    console.log("profile pdfs : " + profile.pdfs);

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
            console.log("foundCollege.topperformer: " + foundCollege.topPerformer);
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
            console.log("sorted topPerformer: " + foundCollege.topPerformer);
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
