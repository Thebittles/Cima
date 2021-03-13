// grab the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Creat a schema

const doctorSchema = new Schema ({
  name: {
      type: String,
      required: true
  }
})