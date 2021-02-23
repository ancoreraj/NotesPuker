const express = require('express')
const router = express.Router()
// const { ensureAuth, ensureGuest } = require('../middleware/auth')

// const Story = require('../models/Story')

router.get('/', (req, res) => { 
    res.render("index")
})

// // @desc    Login/Landing page
// // @route   GET /
// router.get('/', ensureGuest, (req, res) => {
//   res.render('login', {
//     layout: 'login',
//   })
// })

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
