var express = require('express');
var expressListRoutes = require('express-list-routes');
var router = express.Router();
var jwt = require('express-jwt');

//to make sure that only authenticated users can access the /profile route. The way to validate a request is to ensure that the JWT sent with it is genuine, by using the secret again.

var auth = jwt({
  secret: 'MY_SERVER_SECRET_KEY',
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless({path: ['/api/login']});

// var ctrlProfile = require('../controllers/profile');
// const ctrlHome = require('../controllers/home');router.get('/employees', ctrlUsers.getusers);

const ctrlAuth = require('../controllers/authentication');
const ctrlUsers = require("../controllers/users");
const ctrlLoginRecord = require("../controllers/login-record-controller");

router.post('/login',auth, ctrlAuth.login);

router.get('/employees', auth, ctrlUsers.getusers);
router.post('/addEmployee',auth, ctrlUsers.addUser);  //pls mention POST method else it will waiting the request
router.delete('/deleteEmployee/:id',auth, ctrlUsers.deleteUser);
router.post('/userActivation/:id', auth, ctrlUsers.userActivation);
router.get('/login_records/', auth, ctrlLoginRecord.login_records);
router.post('/login_records_add', auth, ctrlLoginRecord.login_recordsAdd)
router.get('/get_login_record/:login_record_id', auth, ctrlLoginRecord.login_recordsView)
router.delete('/deleteLoginRecord/:user_id/:login_record_id',auth, ctrlLoginRecord.deleteLoginRecord);


// profile
// router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
// router.post('/register', ctrlAuth.register);



// router.get('/home',ctrlHome.getusers)


// console.log(expressListRoutes( router )) 

module.exports = router;