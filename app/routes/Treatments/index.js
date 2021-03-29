const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const now = moment().format('YYYY-MM-DD')
const {isLoggedIn} = require('../../helpers/auth')

const TreatmentModel = require("../../models/treatment");
const urlencodedParser = bodyParser.urlencoded({extended: true});

module.exports = (app) => {
  app.get('/treatment', isLoggedIn, (req, res)=>{
    res.render('treatment.ejs')
    });

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
};
