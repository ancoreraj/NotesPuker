const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const User = require('../models/User')

// // @desc    Profile of the authenticated person
// // @route   GET /profile
router.get('/', ensureAuth ,(req,res)=>{

    
 

})


module.exports = router
