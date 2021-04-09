const passport = require('passport');
const LocalStrategy = require('passport-local');
const {isLoggedOut} = require('../../helpers/auth')
const flash = require('connect-flash');

module.exports = (app) => {


  // login authentication and redirection
  app.post('/login', passport.authenticate('local', //passport.authenticate is middleware function
  {
    
    failureRedirect: '/login',
    failureFlash: true
 
  }), (req,res)=>{
    res.redirect('/dashboard')
  });

  //logout route
   app.get('/logout', (req, res)=>{
     req.logout(); //passport destroys all user data in session
     res.redirect('/login'); //redirects back to login route
  });
}