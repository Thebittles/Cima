const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let TreatmentSchema = new mongoose.Schema ({
   postedBy: {
     type: Schema.ObjectId,
     ref: 'User'
   },
   created: String,
   treatment: {
     type: String,
     required: [true, "Must have a treatment name."]
   },
   start: {
     type: Date,
     required: [true, "Must have a start date."]
   },
   end: {
     type: Date,
     required: false
   },
   effective: {
     type: Number
   },
   review: {
     type: String
   } 
  

  })

module.exports = mongoose.model('Treatment', TreatmentSchema);