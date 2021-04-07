const mongoose = require('mongoose')

const CollegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    topContributers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('College', CollegeSchema)


