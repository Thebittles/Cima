const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let SymptomSchema = new mongoose.Schema ({
   postedBy: {
     type: Schema.ObjectId,
     ref: 'User'
   },
   symptomDate: {
       type: Date,
       required: [true, "Symptom must have a date"]
   },
   painlevel: {
       type: Number,
   },
   bodyLocations: {
       type: Array,
       
   }


  
  })

module.exports = mongoose.model('Symptom', SymptomSchema);