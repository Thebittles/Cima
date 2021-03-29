const keys = require("../../config/keys");
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')

const {isLoggedIn, isLoggedOut} = require('../../helpers/auth')



module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));


    /* NavBar & Landing */
    app.get('/', (req, res)=>{
        res.render('home.ejs') })
        

   
    //login
    app.get('/login', isLoggedOut, (req, res)=>{
        res.render('login.ejs')

    })

    app.get('/contact', (req, res)=>{
        res.render('contact.ejs')
    })
    

    app.get('/dashboard', isLoggedIn, (req, res) =>{
        res.render('dashboard.ejs', {
            user: req.user.firstName,
            data: `I would be for the last 30 days from ${now}`
        })
    });
}