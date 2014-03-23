/*
    Module dependencies
*/

var express = require('express');       // the main ssjs framework
var path = require('path');             // for path manipulation
var mongoose = require('mongoose');
var passport = require('passport');
var RedisStore = require('connect-redis')(express);
var expressValidator = require('express-validator');

var app = express();                    // create an express app

var db = require('./db');
var routes = require('./routes');
var user = require('./routes/user');
var pass = require('./config/passport');

/**
 * Express configuration.
 */

var hour = 3600000;
var day = (hour * 24);
var month = (day * 30);

app.set('port', process.env.PORT || 3000);
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
    secret: 'secretsecretsecretsecret',
    store: new RedisStore({ host: 'localhost', port: 6379 })
}));
//app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    //res.locals.token = req.csrfToken();
    //res.locals.secrets = secrets;
    next();
});
app.use(app.router);
app.use(express.errorHandler());


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/*
    URL routes
*/

app.get('/', function(req, res) {
    res.send('Great!');
});

// register a new user
app.post('/signup', user.signup);

// log a user in
app.post('/signin', user.signin);

// logout a logged in user
app.get('/signout', user.signout);

// get details about logged in user
app.get('/user', pass.isAuthenticated, user.userDetails);

// app.get('/addBathroom', function(req, res) {
//     res.sendfile('addBathroom.html');
// }); // add new bathroom

// app.get('/get/bathrooms/', routes.getAll); // get all bathrooms
// app.post('/add/bathroom', routes.addBathroom); // add a new bathroom
// app.get('/b/:id', routes.getBathroom); // get details about a bathroom

// app.post('/add/review/:bid', routes.addReview); // post a new review at a post
// app.get('/get/reviews/:bid', routes.getReviews); // get reviews for a bathroom

app.listen(app.get('port'));

console.log('Express server listening on port ' + app.get('port'));
