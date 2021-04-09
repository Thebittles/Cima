const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../../models/user');
const moment = require('moment')
const {isLoggedOut} = require('../../helpers/auth');

const now = moment().format('YYYY-MM-DD')

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/register', isLoggedOut, (req, res)=>{
    res.render('register.ejs')

    app.post('/register', (req, res)=>{
      if(!req.body) return res.sendStatus(400)
      const data = JSON.parse(JSON.stringify(req.body));
       
      var newUser = new User(
          {username: req.body.email,
           firstName: req.body.firstname,
           lastName: req.body.lastname,
           DOB: moment(req.body.DOB).format('YYYY-MM-DD'),
           created: now
      });
  
      User.register(newUser, req.body.password, function(err, user){
          if(err){
              console.log(err);
              return res.render('register.ejs', {err: err})
          } else {
              // replaced passport.auth with UserModel.auth
              User.authenticate("local")(req, res, function(){
                  // redirect was going to login anyway to changed
                  res.redirect("/login");
              });
            }
         }) 
      });
   })
 };