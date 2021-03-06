const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { findById } = require('../models/User')

const User = require('../models/User')
const Pdfs = require('../models/Pdfs')

// // @desc    Profile of the authenticated person
// // @route   GET /profile
router.get('/:id', ensureAuth , async (req,res)=>{

    try{
        const profile = await User.findById(req.params.id)
        const pdfs = await Pdfs.find({ user : req.params.id })
        console.log(profile)
        console.log(pdfs)

        res.render("profile",{
            profile,
            pdfs

        })

    }catch(err){

    }

    
 

})


module.exports = router
