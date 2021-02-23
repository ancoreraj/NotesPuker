const express = require('express')
const router = express.Router()
// const { ensureAuth, ensureGuest } = require('../middleware/auth')

// const Story = require('../models/Story')

// // @desc    Login/Landing page
// // @route   GET /
// router.get('/', ensureGuest, (req, res) => {
//   res.render('login', {
//     layout: 'login',
//   })
// })

// // @desc    Login/Landing page
// // @route   GET /
router.get('/', (req, res) => {
  res.render("index")
})
router.get('/lp', (req, res) => {
  res.render("LandingPage")
})
router.get('/db', (req, res) => {
  res.render("dashboard")
})
router.get('/pro', (req, res) => {
  res.render("profile")
})



// // @desc    Dashboard
// // @route   GET /dashboard
// router.get('/dashboard', ensureAuth, async (req, res) => {
//   try {
//     const stories = await Story.find({ user: req.user.id }).lean()
//     res.render('dashboard', {
//       name: req.user.firstName,
//       stories,
//     })
//   } catch (err) {
//     console.error(err)
//     res.render('error/500')
//   }
// })

module.exports = router
