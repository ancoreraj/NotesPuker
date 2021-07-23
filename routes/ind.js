const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const sendEmail = require("./../SendMail/mail")
const User = require('../models/User')

// // @desc    Login/Landing page
// // @route   GET /
router.get('/', ensureGuest, (req,res)=>{
  res.render("LandingPage")
})

router.get('/collegeinput', ensureAuth ,(req,res)=>{
  res.render("collegeInput", {name: req.user.displayName })
})

router.get('/about',(req,res)=>{
  res.render('about_us')
})

router.post('/contact',(req,res)=>{
  const {name, email, message} = req.body
  sendEmail(name, email, message);
  req.flash('success_msg','Email Sent to AncoreNotes.')
  res.redirect('/about')
})


router.post('/collegeinput', ensureAuth, async (req, res) => {
  try {
     await User.findOneAndUpdate({ googleId: req.user.googleId },{collegeName: req.body.college},{new: true},(err,doc)=>{
      if(err){
        console.log(err);
      }else{
        res.redirect('/dashboard')
      }
    })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
