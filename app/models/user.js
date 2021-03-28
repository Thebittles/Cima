const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const moment = require('moment')

let UserSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    DOB: Date,
    password: String,
    pw_confirm: String,
    created: String
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);