var mongoose = require('mongoose');
var loginSchema = require('../models/login-records');  //schema must be require here else it gives error as SCHEMA not defined
const LoginRecord = mongoose.model('LoginRecord');  //table name will small plural=> loginrecords
const User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

// module.exports.login_records = function(req, res){
//     var pageIndex = parseInt(req.query.pageIndex);
//     var pageLimit = parseInt(req.query.pageLimit);
//     var sort_data = {};
//     sort_data[`${req.query.sortCol}`] = req.query.sortOrder;

//     var p1 = new Promise(function(resolve, reject) {
//         LoginRecord.count({}).then(function(recCount){  
//             if(recCount > 0){
//                 resolve(recCount);
//             }
//             else{
//                 reject({msg: "Records not available"});
//             }
//         })
//     }).catch(err => {
//         console.log("ErrMsg--"+err.msg)
//     });

//     p1.then(function(resolve_rec_count,reject){
//         LoginRecord.find({},{},
//             {
//                 skip: pageIndex*pageLimit, limit: pageLimit
//             }).populate("user_id",'email',null,{"email": "asc"}).exec(function(err, loginRecords) {
//                 // console.log(loginRecords)
//             if(err){
//                 sendJSONresponse(res, 422, {
//                     "msgCode": "error",
//                     "message": err.message
//                 });
//             }else{
//                 sendJSONresponse(res, 200, {
//                     "msgCode": "success",
//                     loginRecords_data: loginRecords,
//                     total_rec_count: resolve_rec_count
//                 });
//             }
//         });        
//     }).catch(err => {console.log(err)});
// }

//--------------NEW---R & D---
module.exports.login_records = function(req, res){
    var pageLimit = parseInt(req.query.pageLimit);
    var skip_rec = parseInt(req.query.pageIndex)*pageLimit;
    var sort_data = {};
    sort_data[`${req.query.sortCol}`] = req.query.sortOrder == "asc" ? 1 : -1 ;  
    console.log(req.user)
    
    if(req.user.roleid == 1 || req.user.roleid == 2){ //admin
        var match_query = { roleid: 3, "login_records": {$not: {$in: [null,""]} } }
    }else{ //normal user
        var match_query = { email: req.user.email, "login_records": {$not: {$in: [null,""]} } }
    }
    User.aggregate([
        {$match: 
            match_query
        },
        {$unwind: '$login_records'},
        {   $project: 
            {   user_id: 1, 
                email: 1, 
                login_recordsid: "$login_records._id",
                login_date: "$login_records.login_date", 
                in_time: "$login_records.in_time", 
                out_time: "$login_records.out_time",
                task: "$login_records.task",
            }
        },
        {$sort: sort_data}, // 1 => asc & -1 => desc
        { $skip : skip_rec },
        {$limit: pageLimit}
      ]).exec(function(err, users) {
        if (err) { return console.log(err) }
        sendJSONresponse(res, 200, {
            "msgCode": "success",
            loginRecords_data: users,    
            total_rec_count: users.length
        });  
    });

}; 


//-----------------------
function getValidDateTime(dateStr,in_timeStr,out_timeStr){

    valid_year = new Date(dateStr).getFullYear();
    valid_month = new Date(dateStr).getMonth() + 1;
    valid_day_date = new Date(dateStr).getDate();

    in_min = parseInt(in_timeStr.split(":")[0]);
    in_sec = parseInt(in_timeStr.split(":")[1]);

    out_min = parseInt(out_timeStr.split(":")[0]);
    out_sec = parseInt(out_timeStr.split(":")[1]);

    getDate = new Date(`${valid_year}/${valid_month}/${valid_day_date}`).toISOString();
    getInTime = new Date(`${valid_year}/${valid_month}/${valid_day_date} ${in_min}:${in_sec}:00`).toISOString();
    getOutTime = new Date(`${valid_year}/${valid_month}/${valid_day_date} ${out_min}:${out_sec}:00`).toISOString();
    
    return {getDate: getDate, getInTime: getInTime, getOutTime: getOutTime}
}


module.exports.login_recordsAdd = function(req, res){
    console.log("Calling LoginRecord Adding ----")
    console.log(req.body)
    User.findOne({email: req.user.email}).exec(function(errObj, user) {
        if(errObj){
            console.log(errObj.message);
        }else{
            if(user){
                var loginrecord = new LoginRecord();
                loginrecord.user_id = req.user.id

                validDateTime = getValidDateTime(req.body.login_date,req.body.in_time,req.body.out_time);

                loginrecord.login_date = validDateTime.getDate
                
                loginrecord.in_time = validDateTime.getInTime
                loginrecord.out_time = validDateTime.getOutTime
                loginrecord.task = req.body.task;
                if(loginrecord !== null && loginrecord !== ""){
                    user.login_records.push(loginrecord);
                    user.save(function(err,result){
                        if(err){
                            sendJSONresponse(res, 422, {
                                "msgCode": "error",
                                'message': 'User not saved'
                            });                              
                        }else{
                            sendJSONresponse(res, 200, {
                                "msgCode": "success",
                                'message': 'Record added successfully'
                            });                              
                        }
                    });   
                }
                
            }else{
                console.log("Not found");
            }

        }        
    })
}

module.exports.login_recordsView = function(req,res){
    User.findById({_id: req.user.id}, function(err, user){
        if(err){
            sendJSONresponse(res, 422, {
                "msgCode": "error",
                "message": err.message
            });
        }else{
            var loginrecord = user.login_records.id(req.params.login_record_id);
            if(Object.keys(loginrecord).length > 0){
                sendJSONresponse(res, 200, loginrecord); 
            }else{
                sendJSONresponse(res, 200, {
                    "msgCode": "success",
                    "message": []
                }); 
            }    
        }   
    });     
}


module.exports.deleteLoginRecord = function(req, res){
    User.findById({_id: req.params.user_id}, function(err, user){
        if(err){
            sendJSONresponse(res, 422, {
                "msgCode": "error",
                "message": err.message
            });
        }else{
            user.login_records.id(req.params.login_record_id).remove();
            user.save(function (err,user) {
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
    });
}