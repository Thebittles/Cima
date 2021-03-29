
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const moment = require('moment')
// strategy that sllows us to auth with username/password
const LocalStrategy = require('passport-local');
// uses mongoose as a library to store data in mongodb with local strategy
const passportLocalMongoose = require('passport-local-mongoose');
const {isLoggedIn, isLoggedOut} = require('./helpers/auth')

const PORT = process.env.PORT || 3000
const keys = require('./config/keys')
app.use(express.static('public'))

// formating moments date 
let now = moment().format('YYYY-MM-DD')

//connecting mongoose
mongoose.connect(keys.mongoURI,
{
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

//importing mongoose schema
const UserModel = require("./models/user");
const DoctorModel = require("./models/doctor")
const TreatmentModel = require("./models/treatment")
const SymptomModel = require("./models/symptom");



app.use(bodyParser.json()); // in_added support for json encoded bodies
app.use(bodyParser.urlencoded({extended:true})); // support encoded bodies
const urlencodedParser = bodyParser.urlencoded({extended: true}) 

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


app.get('/dashboard', isLoggedIn, (req, res) =>{
    let thirtyDays = moment().subtract(30, 'd').format('YYYY-MM-DD')
    SymptomModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} }, function(error, results){
        if(error){
            console.log('Error: ', error)
        } else {
            console.log('Found all symptoms from past 30da: '/* , results */)
        }
    })

    TreatmentModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} }, function(error, results){
        if(error){
            console.log('Error: ', error)
        } else {
            console.log('Found all Treatments from past 30da: '/* , results */)
        }
    })

    DoctorModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} }, function(error, results){
        if(error){
            console.log('Error: ', error)
        } else {
            console.log('Found all Doctors from past 30da: '/* , results */)
        }
    })

    res.render('dashboard.ejs', {
        user: req.user.firstName,
        data: `I would be for the last 30 days from ${now}`
    })
});





/* Add Symptom Routes */
app.get('/symptom', isLoggedIn, (req, res)=>{
    res.render('symptom.ejs')
})


app.post('/symptom', isLoggedIn, urlencodedParser, (req,res)=> {

    if(!req.body) return res.sendStatus(400)
    const data = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    console.log(data)
    
    let newSymptom = new SymptomModel({
        postedBy: req.user,
        created: now,
        symptomDate: moment(req.body.symptomDate).format('YYYY-MM-DD'),
        painlevel: req.body["Pain Level"],
        bodyLocations: req.body["Body Locations"],
        typePain: req.body.typePain
   });
    
   newSymptom.save(function(error, result){
       if(error){
           console.log('Error: ', error)
           mongoose.disconnect()
       } else {
           console.log('Saved new Symptom: ', result)
           res.redirect('/dashboard')
           //res.status(201).json(result);
       }
   });
})

/* End Symptom Routes */



/* Add Treatment Routes */
app.get('/treatment', isLoggedIn, (req, res)=>{
res.render('treatment.ejs')
})

app.post('/treatment', isLoggedIn, urlencodedParser, (req,res)=> {
    if(!req.body) return res.sendStatus(400)
    const data = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    console.log(data)

    
    let newTreatment = new TreatmentModel({
        postedBy: req.user,
        created: now,
        treatment: req.body.treatment,
        start: moment(req.body.start).format('YYYY-MM-DD'),
        end: moment(req.body.end).format('YYYY-MM-DD'),
        effective: req.body.effective,
        review: req.body.review
   });
    
   newTreatment.save(function(error, result){
       if(error){
           console.log('Error: ', error)
           mongoose.disconnect()
       } else {
           console.log('Saved new Treatment: ', result)
           res.redirect('/dashboard')
           //res.status(201).json(result);
       }
   });
})
/* End Treatment Routes */




/* Query Routes */
app.get('/dashboard/week', isLoggedIn, urlencodedParser, (req, res)=> {
    let week = moment().subtract(7, 'd').format('YYYY-MM-DD')
    console.log(week)
    SymptomModel.find({postedBy : req.user._id, created: {$gte: `${week}`} }, function(error, results){
        if(error){
            console.log('Error: ', error)
        } else {
            console.log('Found all symptoms from past week: ', results)
        }
    })
    

    TreatmentModel.find({postedBy : req.user._id, created: {$gte: `${week}`} }, function(error, results){
        if(error){
            console.log('Error: ', error)
        } else {
            console.log('Found all Treatments from past week: ', results)
        }
    })

    DoctorModel.find({postedBy : req.user._id, created: {$gte: `${week}`} }, function(error, results){
        if(error){
            console.log('Error: ', error)
        } else {
            console.log('Found all Doctors from past week: ', results)
        }
    })

    res.render('dashboard.ejs',{
        user: req.user.firstName,
        data: `I would be for the past week from: ${now}`,
    })
})


app.get('/dashboard/alltime', isLoggedIn, urlencodedParser, (req, res)=> {
    let allTime = req.user.created


    SymptomModel.find({postedBy : req.user._id, created: {$gte: `${allTime}`} }, function(error, results){
        if(error){
            console.log('Error: ', error)
        } else {
            console.log('Found all symptoms from since account was created: '/* , results */)
        }
    })

    TreatmentModel.find({postedBy : req.user._id, created: {$gte: `${allTime}`} }, function(error, results){
        if(error){
            console.log('Error: ', error)
        } else {
            console.log('Found all Treatments from since account was created: '/* , results */)
        }
    })

    DoctorModel.find({postedBy : req.user._id, created: {$gte: `${allTime}`} }, function(error, results){
        if(error){
            console.log('Error: ', error)
        } else {
            console.log('Found all Doctors from since account was created: '/* , results */)
        }
    })

    
    

    res.render('dashboard.ejs',{
        user: req.user.firstName,
        data: "I would be all time"
    })
})

/* End Query Routes */


require("./routes/Auth")(app);
require("./routes/Doctor")(app);
//require("./routes/Treatments")(app);
//require("./routes/Symptoms")(app);




//Listener
app.listen(PORT, ()=> console.log(`App listening on ${PORT}`))