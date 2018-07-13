var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

module.exports.getusers = function(req, res){
    // Get all users with selected column name & email
    // find({},{})  => first {} contains conditions & {} contains the list of columns that needs to return
    User.find({roleid: 3},{name: true,email: true,is_active: true}).exec(function(err, users) {
        res.status(200).json(users);
    });
}

module.exports.deleteUser = function(req, res){
    User.findByIdAndRemove({_id: req.params.id}, function(err, user){
        if(err){
            sendJSONresponse(res, 422, {
                "msgCode": "error",
                "message": err.message
            });
        }else{
            sendJSONresponse(res, 200, {
                "msgCode": "success",
                "message": "User deleted successfully"
            });
        }
    });
}

module.exports.userActivation = function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            sendJSONresponse(res, 422, {
                "msgCode": "error",
                "message": err.message
            });
        }
        else
        {
            if(!user){
                sendJSONresponse(res, 200, {
                    "msgCode": "error",
                    "message": "Invalid User"
                });                
            }
            else{
                console.log(req.body)
                user.is_active = req.body.toggleVal
                console.log(user.is_active);
                console.log(user);
                user.save(function(user_err,user_res){
                    if(user_err){
                        sendJSONresponse(res, 422, {
                            "msgCode": "error",
                            "message": res.message
                        });
                    }else{
                        var isActivated = (user.is_active == true ? "activated" : "de-activated")
                        sendJSONresponse(res, 200, {
                            "msgCode": "success",
                            "message": `User ${isActivated} successfully`
                        });
                    }                    
                });
            }
        }
    });
}

module.exports.addUser = function(req, res){
    if(!req.body.name || !req.body.email || !req.body.password) {
        sendJSONresponse(res, 422, {
          "message": "All fields required"
        });
        return;
      }
      else
      {
        User.find({email: req.body.email}).exec(function(err, users) {
            if(err){
                console.log("User Create Err--"+err.message);
            }
            else
            {
                if(users.length){
                    sendJSONresponse(res, 200, {
                        "msgCode": "error",
                        "message": `User ${req.body.email} already exists`
                    });                    
                }
                else{
                    var user = new User();
                    user.name = req.body.name;
                    user.email = req.body.email;
                    user.is_active = req.body.is_active;
                    user.roleid = req.body.roleid;
                    user.setPassword(req.body.password);
                    user.save(function(err) {
                        if(err){
                            console.log(err.message)
                            sendJSONresponse(err,422, {
                                "msgCode": "error",
                                "message": err.message
                            });
                        }else{
                            sendJSONresponse(res, 200, {
                                "msgCode": "success",
                                "message": "User added successfully"
                            });
                        }                    
                    });
                } 
            }
        });
    }  
}