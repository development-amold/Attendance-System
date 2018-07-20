var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

module.exports.getusers = function(req, res){
    // Get all users with selected column name & email
    // find({},{})  => first {} contains conditions & {} contains the list of columns that needs to return
    
    var pageIndex = parseInt(req.query.pageIndex);
    var pageLimit = parseInt(req.query.pageLimit);
    var sort_data = {};
    sort_data[`${req.query.sortCol}`] = req.query.sortOrder;

    var p1 = new Promise(function(resolve, reject) {
        User.count({roleid: 3}).then(function(userCount){  
            // console.log("PRoMISE"+userCount);
            if(userCount > 0){
                resolve(userCount);
            }
        })
    }).catch(err => {
        console.log("ErrMsg--"+err.message)
    });

    p1.then(function(resolve_user_count,reject){
        User.find({roleid: 3},{name: true,email: true,is_active: true},
            {
                skip: pageIndex*pageLimit, limit: pageLimit,sort: sort_data
            }).exec(function(err, users) {
            if(err){
                sendJSONresponse(res, 422, {
                    "msgCode": "error",
                    "message": err.message
                });
            }else{
                sendJSONresponse(res, 200, {
                    "msgCode": "success",
                    users_data: users,
                    total_users_count: resolve_user_count
                });
            }
        });        
    }).catch(err => {console.log(err)});
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
                user.is_active = req.body.toggleVal
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