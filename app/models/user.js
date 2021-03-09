const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//setting mongoose db schema
let UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//using plugin from PLM to make provided functions available to userschema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);