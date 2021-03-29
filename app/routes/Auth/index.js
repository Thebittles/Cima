
const keys = require("../../config/keys");
const mongoose = require('mongoose')
const passport = require('passport')


const User = require("../../models/user");


const bodyParser = require("body-parser");



module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));


    
    //login
    app.get('/login', isLoggedOut, (req, res)=>{
        res.render('login.ejs')
    })


    //logout route
app.get('/logout', (req, res)=>{
    req.logout(); //passport destroys all user data in session
    res.redirect('/login'); //redirects back to login route
});
}