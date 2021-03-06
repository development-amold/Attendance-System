var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
// var Schema = mongoose.Schema;

var loginSchema = require('../models/login-records');  //if not defined it gives error 
const loginRecordSchema = mongoose.model('LoginRecord').schema;

// var LoginModel = mongoose.model('LoginRecord');


var userSchema = new mongoose.Schema(
    {
        email: {
                type: String,
                unique: true,
                required: true
        },
        name: {
            type: String,
            required: true
        },
        hash: String,
        salt: String,
        roleid: Number, // 1: SuperAdmin, 2: Admin, 3: User
        is_active: { type: Boolean, default: true},
        login_records: [loginRecordSchema]
    },
    {
        timestamps: true  // auto adds created_At & updated_At fields
    }
);

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};
// https://www.npmjs.com/package/jsonwebtoken
userSchema.methods.generateJwt = function() {  //This data returns each time to client
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);  //set up 7 days of expiry
    return jwt.sign({
    //   _id: this._id,
      id: this.id,
      email: this.email,
      name: this.name,
      roleid: this.roleid,
      is_active: this.is_active,
      exp: parseInt(expiry.getTime()),    //parseInt(expiry.getTime() + 90*1000) //set up expiry time for 90seconds
    }, "MY_SERVER_SECRET_KEY"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);
