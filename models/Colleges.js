const mongoose = require('mongoose')

const CollegeSchema = new mongoose.Schema({
    collegeName: {
        type: String,
        required: true,
    },
    topPerformer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('College', CollegeSchema)