require('./users'); // for importing schema definition of user to User model in this file 
var mongoose = require('mongoose');
var User = mongoose.model('User');
User.count({},function(err,userCount){   //collection.count is deprecated, and will be removed in a future version. Use collection.countDocuments
    console.log("Number of users: "+ userCount)
    if (userCount === 0){
        var user = new User();
        user.email = "admin@user.com";
        user.name = "Admin";
        user.is_admin = true;
        user.setPassword("@dmin1234");
        user.save(function(err,res){
            if(err){
                console.log("---ERROR IN CREATING USER---"+err);
            }else{
                console.log("--USER CREATED---"+res);
            }
        });
    }   
    else{
        console.log("Admin already created");
    }    
});