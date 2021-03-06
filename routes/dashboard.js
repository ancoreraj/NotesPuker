const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const _ = require('lodash')

const User = require('../models/User')
const Pdfs = require('../models/Pdfs')

// @desc    dashboard of the respective college
// @route   GET /dashboard/
router.get('/', ensureAuth ,(req,res)=>{
  req.params.college = req.user.collegeName;

  res.render("dashboard",{college : req.user.collegeName})

})



// @desc    
// @route   GET /dashboard/year/branch
router.get('/:year/:branch', ensureAuth , async (req,res)=>{

  const year = req.params.year
  const branch = req.params.branch
  const college = req.user.collegeName
  var result = branch.replace( /([A-Z])/g, " $1" );
  var branch_sliced = result.charAt(0).toUpperCase() + result.slice(1);
  const br = `All Branches`
  // console.log(branch_sliced)
  // console.log(branch)
  
  if(year === '1'){
    try{
      const pdfs = await Pdfs.find({college: college , year: year});

      pdfs.forEach((pdf)=>{
        console.log(pdf.user.firstName)
      })
    
      res.render("category", {
        branch_sliced : branch_sliced,
        college : college,
        year : year,
        pdfs: pdfs
        
      })

    }catch(err){
      console.log(err)

    }

  }else{

    try{
      const pdfs = await Pdfs.find({college: college , year : year , branch : branch});

      res.render("category", {
        branch_sliced : branch_sliced,
        college : college,
        year : year,
        pdfs : pdfs
      })

    }catch(err){
      console.log(err)

    }
  }

})


//To upload the file
router.post('/uploadfile',ensureAuth,(req,res)=>{
  try{
    const driveUrl = req.body.driveUrl
    const title = req.body.title
    const year = req.body.year
    const branch = _.camelCase(req.body.branch)

    const pdf = new Pdfs({
      title: title,
      driveUrl: driveUrl,
      college: req.user.collegeName,
      year: year,
      branch: branch,
      user: req.user.id,
      userName: req.user.firstName

    })

    // console.log(pdf)

    pdf.save((err)=>{
      console.log(err);
    })

    res.redirect('/dashboard')
  } catch (err){
    console.log(err)

  }

})

//To upvote

router.put('/like', ensureAuth ,(req,res)=>{
  Pdfs.findByIdAndUpdate(req.body.postId,{
      $push:{upvote:req.user.id}
  },{
      new:true
  }).exec((err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }else{
          console.log(result)
      }
  })
})

module.exports = router
