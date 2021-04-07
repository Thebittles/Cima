
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


/* Query Routes */
app.get('/dashboard', isLoggedIn, async (req, res) =>{
    let thirtyDays = moment().subtract(30, 'd').format('YYYY-MM-DD')

    try {
        var doctorData30 = await DoctorModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} }).exec()
    } catch(err){
        console.log(err)
    }

    try {
        var treatmentData = await TreatmentModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} }).exec()
    } catch(err){
        console.log(err)
    }
    //const symptomData = await      SymptomModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} })
    SymptomModel.find({postedBy : req.user._id, symptomDate: {$gte: `${thirtyDays}T00:00:00.000+00:00`} })
        .then(symptomData => {
             console.log(symptomData)
            let totalLogs = symptomData.length
            //this one can go
            let percentage = function(Logs, num){
                let percent = ((Logs/num) * 100)
                return percent.toFixed(2)
            }
            let percent = percentage(totalLogs, 30)
            //console.log('I am the percent ', `${percent}%`)
            let painCount = 0;
            symptomData.forEach(el => {
                painCount+= el.painlevel
            })
            let days = 30
            let avgPain = (painCount / totalLogs).toFixed(2)
            res.render('dashboard.ejs', {
                doctor: doctorData30,
                symptom: symptomData,
                treatment: treatmentData,
                user: req.user.firstName,
                logs: totalLogs,
                percent: percent,
                average: avgPain,
                days: days
            });
        })
        .catch(err => {
            console.log(err)
        })

        })//closes route //req res function

app.get('/week', isLoggedIn, urlencodedParser, async (req, res)=> {
    let week = moment().subtract(7, 'd').format('YYYY-MM-DD')
    const doctorData = await DoctorModel.find({postedBy : req.user._id, created: {$gte: `${week}`} }) 
    const treatmentData = await TreatmentModel.find({postedBy : req.user._id, created: {$gte: `${week}`} }) 
    //const symptomData = await      SymptomModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} })
    SymptomModel.find({postedBy : req.user._id, symptomDate: {$gte: `${week}T00:00:00.000+00:00`} })
        .then(symptomData => {
                  console.log('I am data for the week: ',symptomData)
            let totalLogs = symptomData.length
            let percentage = function(Logs, num){
                let percent = ((Logs/num) * 100)
                return percent.toFixed(2)
            }
            let percent = percentage(totalLogs, 30)
            //console.log('I am the percent ', `${percent}%`)

            let painCount = 0;
            symptomData.forEach(el => {
                painCount+= el.painlevel
            })
            
            let days = 7
            let avgPain = (painCount / totalLogs).toFixed(2)
            //console.log('I am the pain Count :', painCount)
            //console.log('I am the total Logs : ', totalLogs)
            //console.log('I am the Average Pain level : ', avgPain)
        
            res.render('dashboard.ejs', {
                doctor: doctorData,
                symptom: symptomData,
                treatment: treatmentData,
                user: req.user.firstName,
                logs: totalLogs,
                percent: percent,
                average: avgPain,
                days: days
            });
        })
})


app.get('/allTime', isLoggedIn, urlencodedParser, async (req, res)=> {

let allTime = req.user.created
/* 
    var a = moment(allTime).format('YYYY-MM-DD').split('-')
    var b = moment().format('YYYY-MM-DD').split('-')
    console.log(a, b)
 
    let arr1 = a.map((el) => {
         return parseInt(el)
    })

    let arr2 = b.map((el) => {
        return parseInt(el)
   })

    function minus(arr1, arr2){
        let count = [];

        for(i = 0; i < arr1.length; i++){
            let num = arr1[i] - arr2[i]
            count.push(num)
        }

        console.log(count)

    }       
    
    minus(arr1, arr2) */
    //let amount = arr1.diff(arr2,'days')
     //console.log(amount) 
    
    let days = '365'


    const doctorData = await DoctorModel.find({postedBy : req.user._id, created: {$gte: `${allTime}`} }) 
    const treatmentData = await TreatmentModel.find({postedBy : req.user._id, created: {$gte: `${allTime}`} }) 
    //const symptomData = await      SymptomModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} })
    SymptomModel.find({postedBy : req.user._id, symptomDate: {$gte: `${allTime}T00:00:00.000+00:00`} })
        .then(symptomData => {

               
            let totalLogs = symptomData.length
            let percentage = function(Logs, num){
                let percent = ((Logs/num) * 100)
                return percent.toFixed(2)
            }
            let percent = percentage(totalLogs, 30)
            console.log('I am the percent ', `${percent}%`)

            let painCount = 0;
            symptomData.forEach(el => {
                painCount+= el.painlevel
            })
            
            let avgPain = (painCount / totalLogs).toFixed(2)

        
            res.render('dashboard.ejs', {
                doctor: doctorData,
                symptom: symptomData,
                treatment: treatmentData,
                user: req.user.firstName,
                logs: totalLogs,
                percent: percent,
                average: avgPain,
                days: days
            });
        })

})

/* End query routes */



app.get('/test', isLoggedIn, urlencodedParser, (req, res)=> {
    res.render('test.ejs')
})





require("./routes/Auth/index")(app);
require("./routes/Auth/login")(app);
require("./routes/Auth/register")(app);
require("./routes/Auth")(app);
require("./routes/Doctor")(app);
require("./routes/Treatments")(app);
require("./routes/Symptoms")(app);

//Listener
app.listen(PORT, ()=> console.log(`App listening on ${PORT}`))