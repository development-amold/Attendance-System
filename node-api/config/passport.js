var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

// http://www.passportjs.org/docs/downloads/html/ ==> Passport mostly useful to login google, fb, linkedin i.e. accessing third party API from our website

// this is authenticate method of passport calling from authentication.js
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'Employee not found'
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }

      if (!user.is_active) {
        return done(null, false, {
          message: 'Your account suspended !'
        });
      }      

      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));