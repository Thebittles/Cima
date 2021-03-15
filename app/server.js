
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
const keys = require('./config/keys')
app.use(express.static('public'))

//connecting mongoose
mongoose.connect(keys.mongoURI,
{
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

//importing mongoose schema
var UserModel = require("./models/user");

app.use(bodyParser.json()); // in_added support for json encoded bodies
app.use(bodyParser.urlencoded({extended:true})); // support encoded bodies
var urlencodedParser = bodyParser.urlencoded({extended: true}) // switched extended to true to match line 27

//Here, we require passport and initialize it along with its session authentication middleware
//load session middleware in the app object
// gives back function
app.use(require('express-session')({
    secret: 'secret', //used to encript the user session info before saving to db
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


////////////////////////////////////////////////////////////// Route Handlers
/* NavBar & Landing */

app.get('/', (req, res)=>{
    res.render('home.ejs')
})

app.get('/contact', (req, res)=>{
    res.render('contact.ejs')
})

/* End Navbar & Landing */

/* MIDDLEWARE */

//middleware to prevent users from manually going to /newsfeed
isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){ //isAuthenticated is built into passport method and checks to see if user is logged in
        return next(); //move to the next piece of code
    }
    res.redirect('/login')
}

/* END MIDDLEWARES */



/* Logging in Routes */

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


app.get('/dashboard', isLoggedIn, (req, res) =>{
    res.render('dashboard.ejs')
});


//logout route
app.get('/logout', (req, res)=>{
    req.logout(); //passport destroys all user data in session
    res.redirect('/'); //redirects back to root route
});






/* Register Routes */

app.get('/register', (req, res)=>{
    res.render('register.ejs')
})

app.post('/register', (req, res)=>{
    if(!req.body) return res.sendStatus(400)
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(data)
     
    var newUser = new UserModel(
        {username: req.body.email,
         firstName: req.body.firstname,
         lastName: req.body.lastname,
         DOB: req.body.DOB
    });

    UserModel.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect('/register')
        } else {
            // replaced passport.auth with UserModel.auth
            UserModel.authenticate("local")(req, res, function(){
                // redirect was going to login anyway to changed
                res.redirect("/login");
            });
        }
    }) 

})


/* End Register */



/* Add Doctor Routes */

app.get('/doctor', isLoggedIn, (req, res)=>{
    res.render('doctor.ejs')
})


app.post('/doctor', isLoggedIn, urlencodedParser, (req,res)=> {
    if(!req.body) return res.sendStatus(400)
    const data = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    console.log(data)
    res.redirect('/dashboard')
})
/* End Doctor Routes */



/* Add Symptom Routes */
app.get('/symptom', isLoggedIn, (req, res)=>{
    res.render('symptom.ejs')
})


app.post('/symptom', isLoggedIn, urlencodedParser, (req,res)=> {
    if(!req.body) return res.sendStatus(400)
    const data = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    console.log(data)
    let bodyParts = data["Body Locations"]


    res.redirect('/dashboard')
})

/* End Symptom Routes */




/* Add Treatment Routes */
app.get('/treatment', isLoggedIn, (req, res)=>{
res.redirect('/dashboard')
})



app.post('/treatment', isLoggedIn, urlencodedParser, (req,res)=> {
    if(!req.body) return res.sendStatus(400)
    const data = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    console.log(data)
   
    res.redirect('/dashboard')
})
/* End Treatment Routes */









//Listener
app.listen(PORT, ()=> console.log(`App listening on ${PORT}`))