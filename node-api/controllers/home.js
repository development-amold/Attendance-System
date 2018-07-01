var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.getusers = function(req, res){
    // Get all users with selected column name & email
    // find({},{})  => first {} contains conditions & {} contains the list of columns that needs to return
    User.find({},{name: true,email: true}).exec(function(err, users) {
        res.status(200).json(users);
    });
}