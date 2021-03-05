const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const _ = require('lodash')

const User = require('../models/User')
const Pdfs = require('../models/Pdfs')

//To upvote

// router.get('/:id', ensureAuth ,(req,res)=>{

//   Pdfs.findByIdAndUpdate(req.body.postId,{
//       $push:{upvote:req.user.id}
//   },{
//       new:true
//   }).exec((err,result)=>{
//       if(err){
//           return res.status(422).json({error:err})
//       }else{
//           console.log(result)
//       }
//   })

//   res.redirect('/dashboard/')
// })

module.exports = router
