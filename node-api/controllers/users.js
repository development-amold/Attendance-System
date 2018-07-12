var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

module.exports.getusers = function(req, res){
    // Get all users with selected column name & email
    // find({},{})  => first {} contains conditions & {} contains the list of columns that needs to return
    console.log(req.headers.auth)
    User.find({},{name: true,email: true}).exec(function(err, users) {
        res.status(200).json(users);
    });
}

module.exports.addUser = function(req, res){
    console.log("---REQUSET NODE---"+req)
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
        user.is_active = req.body.is_active;
        user.roleid = req.body.roleid;
        user.setPassword(req.body.password);
        user.save(function(err) {
            sendJSONresponse(res, 200, {
                "message": "User created successfully"
            });
        });
      }  
}