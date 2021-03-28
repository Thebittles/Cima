const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let SymptomSchema = new mongoose.Schema ({
   postedBy: {
     type: Schema.ObjectId,
     ref: 'User'
   },
   created: String,
   symptomDate: {
       type: Date,
       required: [true, "Symptom must have a date"]
   },
   painlevel: {
       type: Number,
   },
   bodyLocations: {
       type: Array,
       required: [true, "Symptom must have a body location"]
       
   },
   typePain: {
     type: Array,
     required: [true, "Please Select a type of pain"]
   }


  
  })

module.exports = mongoose.model('Symptom', SymptomSchema);