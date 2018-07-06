var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }
  else
  {
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function(err) {
      var token;
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    });
  }  
};

module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate('local', function(err, user, info){  //it validated the localServer as we can use "google", "facebook", "github" thirdparty strategies i.e. provider strategy 

    var token;
    if (err) {
      res.status(404).json(err);
      return;
    }
    // If a user is found
    if(user){
      token = user.generateJwt();
      sendJSONresponse(res, 200, {"token" : token});
    } else {
      // If user is not found
      sendJSONresponse(res, 401, info); //getting data from passport.js
    }
  })(req, res);

};