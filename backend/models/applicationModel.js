const mongoose  = require('mongoose')
const Schema = mongoose.Schema
const applicationSchema = new Schema({
  jobTitle: {
    type: String,   
    required: true
  },
  positionType: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  date_applied: {
    type: Date,
    required: false
  },
  application_Deadline: {
    type: Date,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  jobDescription: {
    type: String,
    required: false
  }


}, {timestamps: true})
module.exports = mongoose.model('applications', applicationSchema)