var mongoose = require('mongoose');
var loginSchema = require('../models/login-records');  //schema must be require here else it gives error as SCHEMA not defined
const LoginRecord = mongoose.model('LoginRecord');  //table name will small plural=> loginrecords
const User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

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
            else{
                reject({msg: "Records not available"});
            }
        })
    }).catch(err => {
        console.log("ErrMsg--"+err.msg)
    });

    p1.then(function(resolve_rec_count,reject){
        LoginRecord.find({},{},
            {
                skip: pageIndex*pageLimit, limit: pageLimit
            }).populate("user_id",'email',null,{"email": "asc"}).exec(function(err, loginRecords) {
                // console.log(loginRecords)
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

//--------------NEW---R &D---
// module.exports.login_records = function(req, res){
//     LoginRecord.aggregate([
//         { "$unwind": "$user_id"},{"$project": {_id: "$_id",email: "$user_id.email"}}
//         // {
//         //     "$group": {_id: "$newemail","email": "$newemail"}
//         // }
        
//     ],function(err,result){
//         if (err) {
//             console.log("err----"+err);
//             // return;
//         }
//         console.log(result)     
//         sendJSONresponse(res, 200, {
//             "msgCode": "success",
//             loginRecords_data: result,
            
//         });               
//     });

    
// }; 


//-----------------------

module.exports.login_recordsAdd = function(req, res){
    console.log("Calling LoginRecord Adding ----")
    User.findOne({email: "e@e.com"}).exec(function(errObj, user) {
        if(errObj){
            console.log(errObj.message);
        }else{
            if(user){
                console.log("user_id---"+user._id);
                var loginrecord = new LoginRecord();
                console.log(req.body)
                loginrecord.user_id = user._id//"5b488f3f16ed6d2c60953514"//req.body.user_id;
                loginrecord.task = "Task_4"//req.body.task;
                loginrecord.in_time = new Date("2018/07/13 10:25:23").toISOString();
                //new Date(new Date("2018/07/16 09:10:23").toISOString())//new Date("2018/07/16 09:10:23");
                loginrecord.out_time = new Date("2018/07/13 21:45:23").toISOString();
                //new Date(new Date("2018/07/16 09:10:23").toISOString())//new Date("2018/07/16 19:45:78");
                loginrecord.save(function(err) {
                    if(err){
                        console.log(err.message)
                        sendJSONresponse(err,422, {
                            "msgCode": "error",
                            "message": err.message
                        });
                    }else{
                        sendJSONresponse(res, 200, {
                            "msgCode": "success",
                            "message": "Record added successfully"
                        });
                    }                    
                });                
            }else{
                console.log("Not found");
            }

        }        
    })
}

module.exports.deleteLoginRecord = function(req, res){
    LoginRecord.findByIdAndRemove({_id: req.params.id}, function(err, record){
        if(err){
            sendJSONresponse(res, 422, {
                "msgCode": "error",
                "message": err.message
            });
        }else{
            sendJSONresponse(res, 200, {
                "msgCode": "success",
                "message": "Record deleted successfully"
            });
        }
    });
}