const passport = require('passport');
const {isLoggedOut} = require('../../helpers/auth')

module.exports = (app) => {

  //login
  app.get('/login', isLoggedOut, (req, res)=>{
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
     res.redirect('/login'); //redirects back to login route
  });
}