//initializing and loading things
var express  = require('express');
var app = express();
var port = process.env.PORT || 8080;
var http = require('http');
var passport = require('passport');
var flash    = require('connect-flash');

var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var configDB = require('./config/database.js');

//==============================================================


require('./config/passport')(passport); // passport for configuration

// set up of express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('bid_para', 0);  //initial bid parameter

// required for passport
app.use(session({ secret: "winteriscoming" })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// require('./app/functions.js')(app);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

//https://scotch.io/tutorials/easy-node-authentication-setup-and-local
