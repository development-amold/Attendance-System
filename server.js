const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('config');

    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var passport = require('passport');

    require('./node-api/models/users');
    require('./node-api/config/passport');

    var routesApi = require('./node-api/expressRoutes/index');

    var dbConfig = config.get('dbConfig');
    // const db_conn_string = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;
    const db_conn_string = 'mongodb://localhost:27017/auth-angular5-node'

    mongoose.Promise = global.Promise;
    mongoose.connect(db_conn_string).then(
        client => {console.log("Connected to database: "+client.connections[0].name) },
        err => { console.log('Can not connect to the database: '+ err)}
    );

    //   scheme://username:password@host:port/database
    //  Production Heroku URL: mongodb://heroku_ff4kqnxp:5vppf5fkcfsri34i4scnjf26cr@ds157089.mlab.com:57089/heroku_ff4kqnxp'
    // Localhost URL: 'mongodb://localhost:27017/angular5-crud-http-node'
    // must specify the NODE_ENV variable on heroku config reveals 

    // OR---WE CAN WRITE IN THE FOLLOWING WAY USING FUNCTION PROTOTYPE  
    // mongoose.connect(config.DB,function(err, client){
    //     if (err)
    //     {
    //         console.log('Can not connect to the database'+ err);
    //     }
    //     else
    //     {
    //         console.log("Connected to database: "+client.db.s.databaseName);
    //     }
    // });

    const app = express();
    app.use(bodyParser.json());
    app.use(cors());    //To be able to access our API from an angular application, we need to enable cors.
    
    const port = process.env.PORT || 4000;
    const server = app.listen(port,function(){
    console.log('Listening on port ' + port);
    });

    app.use(passport.initialize());

    // Create link to Angular build directory
    var distDir = __dirname + "/dist/";
    app.use(express.static(distDir));    

    app.get("/",function(req,res){
        // res.send("<h4>MY NODE HOMEPAGE</h4>");
        res.setHeader('Content-disposition', 'inline;');
        res.setHeader('Content-type', 'text/plain');
        res.sendFile(__dirname+"/README.md");
    });

    // Use the API routes when path starts with /api
    app.use('/api', routesApi);  

    //---------Handling invalid routes through Angular app------
    app.get('/*', function(req,res) {
        res.sendFile(path.join(__dirname+'/dist/index.html'));
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Route Not Found');
        err.status = 404;
        next(err);
    });
    
    // [SH] Catch unauthorised errors
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
        }
    })    

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });    