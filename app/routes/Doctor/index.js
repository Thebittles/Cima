const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const moment = requie('moment')

const {isLoggedIn} = require('../../helpers/auth')

const DoctorModel = require("../../models/doctor");
const urlencodedParser = bodyParser.urlencoded({extended: true})

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/doctor', isLoggedIn, (req, res)=>{
    res.render('doctor.ejs')
})

  app.post('/doctor', isLoggedIn, urlencodedParser, (req,res)=> {
    if(!req.body) return res.sendStatus(400)
    const data = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
    //console.log(data)

  let newDoctor = new DoctorModel({
       //postedBy: username._id,
       postedBy: req.user,
       created: now,
       name: req.body.doctor,
       startV: moment(req.body.startV).format('YYYY-MM-DD'),
       endV: moment(req.body.endV).format('YYYY-MM-DD'),
       phone: req.body.phone,
       address: req.body.address,
       city: req.body.city,
       state: req.body.state,
       zip: req.body.zip,

  });

  newDoctor.save(function(error, result){
      if(error){
          console.log('Error: ', error)
          mongoose.disconnect()
      } else {
          console.log('Saved new Doctor: ', result)
          res.redirect('/dashboard')
      }
    });
  });
}