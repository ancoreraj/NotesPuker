const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const _ = require('lodash')

router.use(bodyParser.urlencoded({extended: true}))

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

//============branch and year functions============================================

function getYear(urlYear) 
{
    var year = ""
    switch(urlYear) {
        case 'first':
            year = "1st Year"
            break
        case 'second':
            year = "2nd Year"
            break
        case 'third':
            year = "3rd Year"
            break
        case 'fourth':
            year = "4th Year"
            break
        default:
            year = ""
    }
    return year
}


function getBranch(urlBranch)
{
    var branch = ""
    switch(urlBranch) {
        case 'be': 
            branch = "BioTech Engineering"
            break
        case 'cve':
            branch = "Civil Engineering"
            break
        case 'cse':
            branch = "Computer Science & Engineering"
            break
        case 'ce':
            branch = "Chemical Engineering"
            break
        case 'ee':
            branch = "Electrical Engineering"
            break
        case 'ece':
            branch = "Electronics & Communication Engineering"
            break
        case 'me': 
            branch = "Mechanical Engineering"
            break
        case 'pe':
            branch = "Production Engineering"
            break
        default:
            branch = ""
    }
    return branch
}

//==========================================================================


//==========Landing Page routing============================================

router.route('/')
    
    .all((req, res, next) => {

        next()
    })

    .get((req, res) => {
        
        res.render("LandingPage")
    })

//==========================================================================


//=========College Input routing============================================

router.route('/ci/:id.user')

    .all((req, res, next) => {

        id = req.params.id
        userName = "Ankur Raj"
        next()
    })

    .get((req, res) => {
        
        // Check for college name in database

        res.render("collegeInput", {
            id: id,
            userName: userName
        })
    })

    .post((req, res) => {
        
        const collegeName = req.body.collegeName
        const collegeUrl = _.lowerCase(collegeName)
        res.redirect(`/db/${id}.user.${collegeUrl}`)
    })

//==========================================================================


//========Dashboard routing=================================================

router.route('/db/:id.user.:college')

    .all((req, res, next) => {
        
        collegeUrl = req.params.college
        collegeName = "IIT Agartala"
        id = req.params.id
        next()
    })

    .get((req, res) => {
        
        res.render("dashboard", {
            collegeName: collegeName, 
            id: id,
            college: collegeUrl
        })
    })

    .post((req, res) => {
        const query = {
            author: "Rahul",
            qustion: req.body.quoraQuestion
        }
        res.redirect(`/db/${id}.user.${collegeUrl}`)
    })

//==========================================================================


//==========Uploading file routing==========================================

router.route('/:id.:college/:yearUrl/:branchUrl')

    .all((req, res, next) => {

        id = req.params.id
        collegeUrl = req.params.college
        branchUrl = req.params.branchUrl
        yearUrl = req.params.yearUrl
        next()
    })

    .get((req, res) => {
        
        const branch = getBranch(branchUrl)
        const year = getYear(yearUrl)
        const collegeName = _.upperCase(collegeUrl)
        res.render("category", {
            id: id,
            yearUrl: yearUrl,
            branchUrl: branchUrl,
            college: collegeUrl,
            branch: branch,
            year: year,
            collegeName: collegeName
        })
    })

    .post((req, res) => {
        const noteDetails = {
            title: req.body.noteTitle,
            link: req.body.noteLink
        }
        console.log(noteDetails);
        // alert("Note uploaded successfully. Thank you for your contribution.")
        res.redirect(`/${id}.${collegeUrl}/${yearUrl}/${branchUrl}`)
    })

//==========================================================================


//=========Profile routing==================================================

router.route('/db/:id.user.:college/pro')

    .all((req, res, next) => {
        
        collegeUrl = req.params.college
        collegeName = "IIT Agartala"
        id = req.params.id

        userName = "Ankur Raj"
        userUploadsCount = 10
        next()
    })

    .get((req, res) => {
        res.render("profile", {
            id: id, 
            college: collegeUrl,
            userName: userName, 
            collegeName: collegeName,
            userUploadsCount: userUploadsCount
        })
    })

//==========================================================================

router.get('/ab', (req, res) => {
    res.render("about_us")
})

router.get('/ct', (req, res) => {
    res.render("contact")
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
