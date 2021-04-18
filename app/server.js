
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const moment = require('moment');
const flash = require('connect-flash');
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
app.use(flash());

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
        var treatmentData30 = await TreatmentModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} }).exec()
    } catch(err){
        console.log(err)
    }
    //const symptomData = await      SymptomModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} })
    SymptomModel.find({postedBy : req.user._id, symptomDate: {$gte: `${thirtyDays}T00:00:00.000+00:00`} })
        .then(symptomData30 => {
             
             
            /* Top bodyLocations Functions */
            const freq = {};
            for (let {bodyLocations} of symptomData30) {
                for (let location of bodyLocations) freq[location] = (freq[location] || 0) + 1;

            }
            const maxFreq = Math.max(...Object.values(freq));
            const location = Object.keys(freq).find(location => freq[location] === maxFreq);
            // This gives you the top location
            //console.log('I am the top location: ', location)
            //console.log(freq)

            function findTop3(obj){
                return Object.keys(obj).sort((a,b) => {return obj[b]-obj[a]}).slice(0,3);
              }
              
             let topThreeBody = findTop3(freq);
              
             let bodyCounts = []
             topThreeBody.forEach(el => {
                 bodyCounts.push(freq[el])
             })

             
            
            /* Top Type of pain Functions */
            const typeFreq = {};

            for (let {typePain} of symptomData30) {
                for (let type of typePain) typeFreq[type] = (typeFreq[type] || 0) + 1;

            }

            const maxType = Math.max(...Object.values(typeFreq));
            const type = Object.keys(typeFreq).find(type => typeFreq[type] === maxType);
            // This gives you the top type
            //console.log('I am the top type of pain:', type)
            //console.log(typeFreq)
            let topThreePain = findTop3(typeFreq);
            let painCounts = []
            topThreePain.forEach(el => {
                painCounts.push(typeFreq[el])
            })

            

             /* Average Pain Functions */
            let totalLogs = symptomData30.length
            //this one can go
            let percentage = function(Logs, num){
                let percent = ((Logs/num) * 100)
                return percent.toFixed(2)
            }
            let percent = percentage(totalLogs, 30)
            //console.log('I am the percent ', `${percent}%`)
            let painCount = 0;
            symptomData30.forEach(el => {
                painCount+= el.painlevel
            })
            let days = 30
            let avgPain = (painCount / totalLogs).toFixed(2)


            res.render('dashboard.ejs', {
                doctor: doctorData30,
                symptom: symptomData30,
                treatment: treatmentData30,
                user: req.user.firstName,
                logs: totalLogs,
                percent: percent,
                average: avgPain,
                days: days,
                topBody: topThreeBody,
                bodyCounts: bodyCounts,
                topPain: topThreePain,
                painCounts: painCounts
            });
        })
        .catch(err => {
            console.log(err)
        })

        })//closes route //req res function

app.get('/week', isLoggedIn, urlencodedParser, async (req, res)=> {
    let week = moment().subtract(7, 'd').format('YYYY-MM-DD')
    try {
        var doctorDataWeek = await DoctorModel.find({postedBy : req.user._id, created: {$gte: `${week}`}}).exec()
        
    } catch (error) {
        console.log(error)
    }
    try {
        var treatmentDataWeek = await TreatmentModel.find({postedBy : req.user._id, created: {$gte: `${week}`}}).exec()
    } catch (error) {
        console.log(error)
    }
    
   
    //const symptomData = await      SymptomModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} })
    SymptomModel.find({postedBy : req.user._id, symptomDate: {$gte: `${week}T00:00:00.000+00:00`} })
        .then(symptomDataWeek => {

                           /* Top bodyLocations Functions */
            const freq = {};

            for (let {bodyLocations} of symptomDataWeek) {
                for (let location of bodyLocations) freq[location] = (freq[location] || 0) + 1;

            }

            const maxFreq = Math.max(...Object.values(freq));
            const location = Object.keys(freq).find(location => freq[location] === maxFreq);
            // This gives you the top location
            console.log('I am the top location: ', location)
           

            function findTop3(obj){
                return Object.keys(obj).sort((a,b) => {return obj[b]-obj[a]}).slice(0,3);
              }
              
              let topThreeBody = findTop3(freq);
              
              let bodyCounts = []
              topThreeBody.forEach(el => {
                  bodyCounts.push(freq[el])
              })
              /* End body functions */
            

            /* Top Type of pain Functions */
            const typeFreq = {};

            for (let {typePain} of symptomDataWeek) {
                for (let type of typePain) typeFreq[type] = (typeFreq[type] || 0) + 1;

            }

            const maxType = Math.max(...Object.values(typeFreq));
            const type = Object.keys(typeFreq).find(type => typeFreq[type] === maxType);
            // This gives you the top pain
            let topThreePain = findTop3(typeFreq);
            let painCounts = []
            topThreePain.forEach(el => {
                painCounts.push(typeFreq[el])
            })
            /* End pain functions */

            /* ==========Average Pain Functions ====== */

            let totalLogs = symptomDataWeek.length
            let percentage = function(Logs, num){
                let percent = ((Logs/num) * 100)
                return percent.toFixed(2)
            }
            let percent = percentage(totalLogs, 30)
            //console.log('I am the percent ', `${percent}%`)

            let painCount = 0;
            symptomDataWeek.forEach(el => {
                painCount+= el.painlevel
            })
            
            let days = 7
            let avgPain = (painCount / totalLogs).toFixed(2)
            //console.log('I am the pain Count :', painCount)
            //console.log('I am the total Logs : ', totalLogs)
            //console.log('I am the Average Pain level : ', avgPain)
        
            res.render('dashboard.ejs', {
                doctor: doctorDataWeek,
                symptom: symptomDataWeek,
                treatment: treatmentDataWeek,
                user: req.user.firstName,
                logs: totalLogs,
                percent: percent,
                average: avgPain,
                days: days,
                topBody: topThreeBody,
                bodyCounts, bodyCounts,
                topPain: topThreePain,
                painCounts: painCounts
            });
        })
        .catch(err =>{
           console.log(err)     
        })
})


app.get('/year', isLoggedIn, urlencodedParser, async (req, res)=> {

let year = moment().subtract(365, 'd').format('YYYY-MM-DD')

    try {
        var doctorDataYear = await DoctorModel.find({postedBy : req.user._id, created: {$gte: `${year}`} }) 
    } catch (error) {
       console.log(error) 
    }
    try {
        var treatmentDataYear = await TreatmentModel.find({postedBy : req.user._id, created: {$gte: `${year}`} })
    } catch (error) {
        console.log(error)
    }
    
    //const symptomData = await      SymptomModel.find({postedBy : req.user._id, created: {$gte: `${thirtyDays}`} })
    SymptomModel.find({postedBy : req.user._id, symptomDate: {$gte: `${year}T00:00:00.000+00:00`} })
        .then(symptomDataYear => {
               

            /* Top bodyLocations Functions */
            const freq = {};

            for (let {bodyLocations} of symptomDataYear) {
                for (let location of bodyLocations) freq[location] = (freq[location] || 0) + 1;

            }

            const maxFreq = Math.max(...Object.values(freq));
            const location = Object.keys(freq).find(location => freq[location] === maxFreq);
            // This gives you the top location

            function findTop3(obj){
                return Object.keys(obj).sort((a,b) => {return obj[b]-obj[a]}).slice(0,3);
              }
              
              let topThreeBody = findTop3(freq);
              
              let bodyCounts = []
              topThreeBody.forEach(el => {
                  bodyCounts.push(freq[el])
              })
 
              /* Top Body Functions END */




            /* Top Type of pain Functions */
            const typeFreq = {};

            for (let {typePain} of symptomDataYear) {
                for (let type of typePain) typeFreq[type] = (typeFreq[type] || 0) + 1;

            }

            const maxType = Math.max(...Object.values(typeFreq));
            const type = Object.keys(typeFreq).find(type => typeFreq[type] === maxType);
            // This gives you the top type
            let topThreePain = findTop3(typeFreq);
            let painCounts = []
            topThreePain.forEach(el => {
                painCounts.push(typeFreq[el])
            })
            /* Top Pain Functions END */




            /* Average Pain Functions */
            let totalLogs = symptomDataYear.length
            let percentage = function(Logs, num){
                let percent = ((Logs/num) * 100)
                return percent.toFixed(2)
            }
            let percent = percentage(totalLogs, 30)
            console.log('I am the percent ', `${percent}%`)

            let painCount = 0;
            symptomDataYear.forEach(el => {
                painCount+= el.painlevel
            })
            let days = 365
            let avgPain = (painCount / totalLogs).toFixed(2)

        
            res.render('dashboard.ejs', {
                doctor: doctorDataYear,
                symptom: symptomDataYear,
                treatment: treatmentDataYear,
                user: req.user.firstName,
                logs: totalLogs,
                percent: percent,
                average: avgPain,
                days: days,
                topBody: topThreeBody,
                bodyCounts: bodyCounts,
                topPain: topThreePain,
                painCounts: painCounts

            });
        })
        .catch(error => {
            console.error(error)
        })  
})

/* End query routes */


// Delete data
app.delete("/dashboard/:id", (req, res) => {
    let requestedToDoId = req.params.id;
    
    console.log(requestedToDoId, typeof(requestedToDoId))
    SymptomModel.findOneAndDelete({_id: requestedToDoId}, function(error, result){
      if(error){
          console.log(error)
        res.status(400).send('Id does not exist for deletion')
      } else {
        res.status(201).send(result)
      }
    })
  });






require("./routes/Auth/index")(app);
require("./routes/Auth/login")(app);
require("./routes/Auth/register")(app);
require("./routes/Auth")(app);
require("./routes/Doctor")(app);
require("./routes/Treatments")(app);
require("./routes/Symptoms")(app);

//Listener
app.listen(PORT, ()=> console.log(`App listening on ${PORT}`))