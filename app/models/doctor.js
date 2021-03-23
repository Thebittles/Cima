// grab the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Creat a schema

let DoctorSchema = new mongoose.Schema ({
  postedBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: {
      type: String,
      required: [true, "Must have Doctor Name."]
  },
  startV: {
    type: Date,
    required: [true, "Must have a start visit date."]
  },
  endV: {
    type: Date,
    required: false
  },
  phone: String,
  adddress: String,
  city: String,
  state: String,
  zip: String

})


module.exports = mongoose.model('Doctor', DoctorSchema);