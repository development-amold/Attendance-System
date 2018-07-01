var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

  if (!req.payload.id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(req.payload.id)
      .exec(function(err, user) {
        console.log("PAYLOAD")
        console.log(user);            
        res.status(200).json(user);
      });
  }

};