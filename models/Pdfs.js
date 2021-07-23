const mongoose = require('mongoose')

const PdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  driveUrl: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: {
    type: String,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }]
})

module.exports = mongoose.model('Pdf', PdfSchema)

// upvotes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }]
