var mongoose = require('mongoose');
var loginSchema = require('../models/login-records');  //schema must be require here else it gives error as SCHEMA not defined
const LoginRecord = mongoose.model('LoginRecord');  //table name will small plural=> loginrecords
const User = mongoose.model('User');
var excel = require("exceljs");
const tempfile_var = require('tempfile');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
  };

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

function formatTimeIn2Digits(hoursObj,minutesObj){
    var hrs = hoursObj <= 9 ? '0' + hoursObj : hoursObj;
    var mins = minutesObj <= 9 ? '0' + minutesObj : minutesObj;
    return `${hrs}:${mins}`;
}

module.exports.login_records = function(req, res){
    var pageLimit = parseInt(req.query.pageLimit);
    var skip_rec = parseInt(req.query.pageIndex)*pageLimit;
    var sort_data = {};
    sort_data[`${req.query.sortCol}`] = req.query.sortOrder == "asc" ? 1 : -1 ;  
    
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
        {
            $group: {
                _id: null,
                total_count: {$sum: 1}  //count of all the records
            }
        },        
    ]).then(function(loginRecordsGroupObj){
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
            users.forEach(element => {
                element.in_time = formatTimeIn2Digits(element.in_time.getHours(),element.in_time.getMinutes());
                element.out_time = formatTimeIn2Digits(element.out_time.getHours(),element.out_time.getMinutes());
            });
            sendJSONresponse(res, 200, {
                "msgCode": "success",
                loginRecords_data: users,    
                total_rec_count: loginRecordsGroupObj[0].total_count  //get total records count with help of promise
            });  
        });
    }
    ).catch(err => {console.log(err.message)});


}; 

module.exports.login_recordsAdd = function(req, res){
    console.log("Calling LoginRecord Adding ----")
    console.log(req.body)
    User.findOne({email: req.user.email}).exec(function(errObj, user) {
        if(errObj){
            console.log(errObj.message);
        }else{
            try {
                if(user){
                    var loginrecord = new LoginRecord();
                    loginrecord.user_id = req.user.id
    
                    validDateTime = getValidDateTime(req.body.login_date,req.body.in_time,req.body.out_time);
    
                    loginrecord.login_date = validDateTime.getDate
                    
                    loginrecord.in_time = validDateTime.getInTime
                    loginrecord.out_time = validDateTime.getOutTime
                    loginrecord.task = req.body.task;
                    if(loginrecord !== null && loginrecord !== ""){
                        console.log(user.login_records);
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
            }catch(exp){
                console.log(exp.message)
            }
        }        
    })
}

module.exports.login_recordsView = function(req,res){
    // User.findOne({"login_records._id": req.params.login_record_id }, function(err, user){
    //     if(err){
    //         sendJSONresponse(res, 422, {
    //             "msgCode": "error",
    //             "message": err.message
    //         });
    //     }else{
    //         var loginrecord = user.login_records.id(req.params.login_record_id);
    //         if(Object.keys(loginrecord).length > 0){
    //             sendJSONresponse(res, 200, loginrecord); 
    //         }else{
    //             sendJSONresponse(res, 200, {
    //                 "msgCode": "success",
    //                 "message": []
    //             }); 
    //         }    
    //     }   
    // });  
    User.findOne({"login_records._id": req.params.login_record_id }, function(err, user){
        if(err){
            sendJSONresponse(res, 422, {
                "msgCode": "error",
                "message": err.message
            });
        }else{
            var loginrecord = user.login_records.id(req.params.login_record_id);
            
            modified_loginrecord = {}
            modified_loginrecord["_id"] = loginrecord._id;
            modified_loginrecord["user_id"] = loginrecord.user_id;
            modified_loginrecord["login_date"] = loginrecord.login_date;
            modified_loginrecord["in_time"] = formatTimeIn2Digits(loginrecord.in_time.getHours(),loginrecord.in_time.getMinutes());
            //`${loginrecord.in_time.getHours() <= 9 ? 0 + }:${loginrecord.in_time.getMinutes()}`;
            modified_loginrecord["out_time"] = formatTimeIn2Digits(loginrecord.out_time.getHours(),loginrecord.out_time.getMinutes());
            //`${loginrecord.out_time.getHours()}:${loginrecord.out_time.getMinutes()}`;
            modified_loginrecord["task"] = loginrecord.task;
            if(Object.keys(loginrecord).length > 0){
                sendJSONresponse(res, 200, modified_loginrecord); 
            }else{
                sendJSONresponse(res, 200, {
                    "msgCode": "success",
                    "message": []
                }); 
            }    
        }   
    });        
}

module.exports.edit_login_record = function(req,res){
    User.findOne({"login_records._id": req.params.login_record_id }, function(err, user){
        if(err){
            sendJSONresponse(res, 422, {
                "msgCode": "error",
                "message": err.message
            });
        }else{
            var loginrecord = user.login_records.id(req.params.login_record_id);
            
            modified_loginrecord = {}
            modified_loginrecord["_id"] = loginrecord._id;
            modified_loginrecord["user_id"] = loginrecord.user_id;
            modified_loginrecord["login_date"] = loginrecord.login_date;
            modified_loginrecord["in_time"] = formatTimeIn2Digits(loginrecord.in_time.getHours(),loginrecord.in_time.getMinutes());
            //`${loginrecord.in_time.getHours() <= 9 ? 0 + }:${loginrecord.in_time.getMinutes()}`;
            modified_loginrecord["out_time"] = formatTimeIn2Digits(loginrecord.out_time.getHours(),loginrecord.out_time.getMinutes());
            //`${loginrecord.out_time.getHours()}:${loginrecord.out_time.getMinutes()}`;
            modified_loginrecord["task"] = loginrecord.task;
            if(Object.keys(loginrecord).length > 0){
                sendJSONresponse(res, 200, modified_loginrecord); 
            }else{
                sendJSONresponse(res, 200, {
                    "msgCode": "success",
                    "message": []
                }); 
            }    
        }   
    });     
}


module.exports.update_login_record = function(req, res){
    console.log("------Calling LoginRecord UPDATING ----");
    User.findOne({email: req.user.email}).exec(function(errObj, user) {
        if(errObj){
            console.log(errObj.message);
        }else{
            try {
                if(user){
                    var existing_loginrecord = user.login_records.id(req.params.login_record_id);
                    if(existing_loginrecord){
                        validDateTime = getValidDateTime(req.body.login_date,req.body.in_time,req.body.out_time);
                        var modified_login_record = {
                            user_id: req.user.id,
                            login_date: validDateTime.getDate,
                            in_time: validDateTime.getInTime,
                            out_time: validDateTime.getOutTime,
                            task: req.body.task
                        }
                        existing_loginrecord.set(modified_login_record) //IMP
                        // using Promise instead of callback
                        user.save().then(function(result){
                            sendJSONresponse(res, 200, {
                                "msgCode": "success",
                                'message': 'Record updated successfully'
                            });   
                        }).catch(function(err){
                            console.log(err.message)
                            sendJSONresponse(res, 422, {
                                "msgCode": "error",
                                'message': `User not saved`
                            });                              
                        });
                    }else{
                        console.log("Login Record Not Found");
                    }
                }else{
                    console.log("User Not found");
                }
            }catch(exp){
                console.log(exp.message)
            }
        }        
    })
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

module.exports.login_records_report_by_month = function(req,res){
    try {
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
            {
                $group: {
                    _id: null,
                    total_count: {$sum: 1}  //count of all the records
                }
            },        
        ]).then(function(loginRecordsGroupObj){
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
                {$sort: {email: 1}}, // 1 => asc & -1 => desc
                // { $skip : skip_rec },
                // {$limit: pageLimit}
            ]).exec(function(err, users) {
                if (err) { return console.log(err) }
                var workbook = new excel.Workbook();
                var worksheet = workbook.addWorksheet('Report Sheet');
                
                worksheet.mergeCells('A1', 'D1');
                worksheet.getCell('A1').value = 'Login Records List';
                worksheet.getCell('A1').style = { font: { name: 'Arial Black' } };
                worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
                
                worksheet.getRow(2).values = ['Email', 'Login Date', 'In-Time', 'Out-Time'];

                worksheet.columns = [
                    {key: 'email', width: 20, style: { font: { name: 'Arial Black' } }},
                    {key: 'logindate',width: 20,style: { numFmt: 'dd/mm/yyyy' }},
                    {key: 'intime',width: 15},
                    {key: 'outtime',width: 15}
                ];

                users.forEach(element => {
                    element.in_time = formatTimeIn2Digits(element.in_time.getHours(),element.in_time.getMinutes());
                    element.out_time = formatTimeIn2Digits(element.out_time.getHours(),element.out_time.getMinutes());
                });       
                users.forEach(element => {
                    valid_year = new Date(element.login_date).getFullYear();
                    valid_month = new Date(element.login_date).getMonth() + 1;
                    valid_month = valid_month > 9 ? valid_month : '0'+valid_month;
                    valid_day_date = new Date(element.login_date).getDate();                    
                    // console.log(`${valid_day_date}-${valid_month}-${valid_year}`)
                    loginDate = `${valid_day_date}-${valid_month}-${valid_year}`;
                    worksheet.addRow({
                        email: element.email,
                        intime: element.in_time, 
                        outtime: element.out_time,
                        logindate: loginDate
                    });
                });
                var tempFilePath = tempfile_var('.xlsx');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");            
                workbook.xlsx.writeFile(tempFilePath).then(function(data) {
                    res.sendFile(tempFilePath, function(err){
                        if(err){
                            console.log('---------- error downloading file----: ' + err);
                        }
                    });
                });                
            });
        }
        ).catch(err => {console.log(err.message)});
                

    } catch(err) {
        console.log('this is the error: ' + err);
    }    
}