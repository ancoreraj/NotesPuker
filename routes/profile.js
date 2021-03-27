const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { findById } = require('../models/User')

const User = require('../models/User')
const Pdfs = require('../models/Pdfs')
const { Types } = require('mongoose')
const Colleges = require('../models/Colleges')

// // @desc    Profile of the authenticated person
// // @route   GET /profile/userid
router.get('/:id', ensureAuth , async (req,res)=>{

    try{
        const guestId = req.params.id;
        const authorId = req.user.id;
        const guestProfile = await User.findById(guestId);
        const authorProfile = await User.findById(authorId);
        const guestPdfs = await Pdfs.find({ user : guestId });
        console.log(guestProfile)

        if (guestId === authorId) {
            res.render("profile", {
                guestProfile: guestProfile,
                authorProfile: authorProfile,
                pdfs: guestPdfs,
                check: "true"
            });
        }
        else {
            res.render("profile", {
                guestProfile: guestProfile,
                authorProfile: authorProfile,
                pdfs: guestPdfs,
                check: "false"
            })
        }
    }catch(err){

    }

})


// Delete the pdf file
router.post('/:pdfId', ensureAuth, async (req, res) => {
  try {
    const pdfId = req.params.pdfId;  
    var profile = await User.findById(req.user.id);
    await Pdfs.findByIdAndRemove(pdfId, async (err, docs) => {
        if(err){
            console.log(err);
        }else{
            const pdfs = await Pdfs.find({ user : req.user.id});
            res.render("profile", {
                guestProfile: profile,
                authorProfile: profile,
                pdfs: pdfs,
                check: "true"
            })
            
            // console.log(req.user.id);
        }
    })
    const idx1 = profile.pdfs.indexOf(pdfId);
    profile.pdfs.splice(idx1, 1);
    profile.save((err) => {
        console.log(err);
    })
    await Colleges.findOne({collegeName: req.user.collegeName})
    .populate('topPerformer')
    .exec(async(err, foundCollege) => {
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

  } catch (err) {
    console.error(err)
  }
})

//Update the College
router.post('/update/:id',ensureAuth,(req,res)=>{
    
})


module.exports = router
