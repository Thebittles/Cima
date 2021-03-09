
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
// strategy that sllows us to auth with username/password
const LocalStrategy = require('passport-local');
// uses mongoose as a library to store data in mongodb with local strategy
const passportLocalMongoose = require('passport-local-mongoose');

const PORT = process.env.PORT || 3000

app.use(express.static('public'))

//connecting mongoose
mongoose.connect("mongodb://mongo.accsoftwarebootcamp.com/cima_passport",
{
  user: "accadmin",
  pass: "acc_rocks_2020",
  auth: {
      authSource: "admin"
  },
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

//importing mongoose schema
var UserModel = require("./models/user");

app.use(bodyParser.urlencoded({extended:true}));

//load session middleware in the app object
// gives back function
app.use(require('express-session')({
    secret: 'Blah Blah Blah', //used to encript the user session info before saving to db
    resave: false, //save the session obj if not changed
    saveUninitialized: false //save the session obj even if not initialized
}));

//generating functions from core passport library and loading to app object
app.use(passport.initialize());
// generating (middleware) functions from the session core library and loading to app obj
app.use(passport.session());
//loading authentication functions and local strategy to passport obj
passport.use(new LocalStrategy(UserModel.authenticate()));
// load functions into passport obj that allow us to save to db -- register or login
passport.serializeUser(UserModel.serializeUser());
// load functions to read from db into passport function -- whenever user uses a protected route
passport.deserializeUser(UserModel.deserializeUser());

// Route Handlers
app.get('/', (req, res)=>{
    res.render('home.ejs')
})

app.get('/about', (req, res)=>{
    res.render('index.ejs')
})

app.get('/login', (req, res)=>{
    res.render('login.ejs')
})
// login authentication and redirection
app.post('/login', passport.authenticate('local', //passport.authenticate is middleware function
{
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}), (req,res)=>{
    //nothing is needed inside callback function bc middleware has handled route handling
});
//logout route
app.get('/logout', (req, res)=>{
    req.logout(); //passport destroys all user data in session
    res.redirect('/'); //redirects back to root route
});
//middleware to prevent users from manually going to /newsfeed
isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){ //isAuthenticated is built into passport method and checks to see if user is logged in
        return next(); //move to the next piece of code
    }
    res.redirect('/login')
}
//newsfeed route
app.get('/dashboard', isLoggedIn, (req, res) =>{
    res.render('newsfeed.ejs')
});

app.get('/register', (req, res)=>{
    res.render('register.ejs')
})



//Listener
app.listen(PORT, ()=> console.log(`App listening on ${PORT}`))