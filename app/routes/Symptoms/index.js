const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const {isLoggedIn} = require('../../helpers/auth');

const SymptomModel = require('../../models/symptom');
const now = moment().format('YYYY-MM-DD');
const urlencodedParser = bodyParser.urlencoded({extended: true});

module.exports = (app) => {
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
      symptomDate: moment(req.body.start).format('YYYY-MM-DD'),
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
};