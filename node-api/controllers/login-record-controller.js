var mongoose = require('mongoose');
var loginSchema = require('../models/login-records');  //schema must be require here else it gives error as SCHEMA not defined

const LoginRecord = mongoose.model('LoginRecord');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };
console.log("OUSCMODEL")
module.exports.login_records = function(req, res){
    var pageIndex = parseInt(req.query.pageIndex);
    var pageLimit = parseInt(req.query.pageLimit);
    var sort_data = {};
    sort_data[`${req.query.sortCol}`] = req.query.sortOrder;

    var p1 = new Promise(function(resolve, reject) {
        LoginRecord.count({}).then(function(recCount){  
            if(recCount > 0){
                resolve(recCount);
            }
        })
    }).catch(err => {
        console.log("ErrMsg--"+err.message)
    });

    p1.then(function(resolve_rec_count,reject){
        LoginRecord.find({},{},
            {
                skip: pageIndex*pageLimit, limit: pageLimit,sort: sort_data
            }).exec(function(err, loginRecords) {
                console.log(loginRecords)
            if(err){
                sendJSONresponse(res, 422, {
                    "msgCode": "error",
                    "message": err.message
                });
            }else{
                sendJSONresponse(res, 200, {
                    "msgCode": "success",
                    loginRecords_data: loginRecords,
                    total_rec_count: resolve_rec_count
                });
            }
        });        
    }).catch(err => {console.log(err)});
}