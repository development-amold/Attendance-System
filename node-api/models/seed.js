require('./users'); // for importing schema definition of user to User model in this file 
var mongoose = require('mongoose');
var User = mongoose.model('User');


User.count({},function(err,userCount){   //collection.count is deprecated, and will be removed in a future version. Use collection.countDocuments
    console.log("Number of users: "+ userCount)
    if (userCount < 3){
        var admins = [
            {
                email: "superadmin@domain.com",
                name: "SuperAdmin",
                roleid: 1,
                password: "Superadmin=1234"
            },
            {
                email: "admin@domain.com",
                name: "Admin",
                roleid: 2,
                password: "Admin=1234"
            },
            {
                email: "user@domain.com",
                name: "user",
                roleid: 3,
                password: "User=1234"
            }            
        ];        
        admins.forEach(key => {
            console.log(key.email);
            var user = new User();
            user.email = key.email;
            user.name = key.name;
            user.roleid = key.roleid;
            user.setPassword(key.password);
            user.save(function(err,res){
                if(err){
                    console.log("---ERROR IN CREATING USER---"+err);
                }else{
                    console.log("--USER CREATED---"+res);
                }
            });            
        });        
    }   
    else{
        console.log("Admins are already created...!");
    }    
});