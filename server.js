//initializing and loading things
var express  = require('express');
var app = express();
var port = process.env.PORT || 3000;
var serv = require('http').Server(app);
var io = require('socket.io').listen(serv); // for p2p chat.
var passport = require('passport');
var flash    = require('connect-flash');

var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan'); // to log everything

var configDB = require('./config/database.js'); // including database config
//==============================================================


require('./config/passport')(passport); // passport for configuration
schedule_auction = require('./app/functions_admin'); // including admin functions

// set up of express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// session configs
app.use(session({ 

	secret: "winteriscoming", // session key
	resave: true,
    saveUninitialized: true,
		cookie: {
			httpOnly: true,
			secure: false
	}
	})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// require('./app/functions.js')(app);

// launch ======================================================================
serv.listen(port, function () {
	console.log('server initiated');
	//==============================================================================
	//=============== DAILY AUCTION SCHEDULE CODE ==================================
	//==============================================================================

	schedule_auction.schedule_auction();


});
// port
console.log('Server running on port: ' + port);

// error handler  == not working as of now
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
})


//==============================================================================
//=============== CHAT CODE ====================================================
//==============================================================================

var clients =[]; //store clients socket id and account id who are online

    io.sockets.on('connection', function (socket) { // on connection

    	// add clent to clients array when online     
        socket.on('storeClientInfo', function (data) {

            var clientInfo = new Object();
            clientInfo.customId = data.id;
            clientInfo.clientId = socket.id;
            clients.push(clientInfo);
            console.log("Added new client " + JSON.stringify(clients));
        });

        // when a chat message comes in
        socket.on('chat_message', function(data){
        	console.log(data);
        	console.log("New msg recieved " + JSON.stringify(clients) + JSON.stringify(data));

        	var toWhom;

        	for(var i = 0; i < clients.length; i++)
			{
			  if(clients[i].customId == data.ToWhomId)
			  {
			    toWhom = clients[i].clientId;
			    break;
			  }
			}
			console.log(toWhom);

			if(toWhom){
				senddata = {
					msg : data.msg,
					to : toWhom,
					from : socket.id
				}
				io.to(toWhom).emit('newChatMsg', senddata);
			}
			// 

        });

        // when a client is disconnected, (remove from clients)
        socket.on('disconnect', function (data) {

            for( var i=0, len=clients.length; i<len; ++i ){
                var c = clients[i];

                if(c.clientId == socket.id){
                    clients.splice(i,1);
                    console.log("client removed " + JSON.stringify(clients));
                    break;
                }
            }

        });
    });

// useful link to understand hoe the login system works
//https://scotch.io/tutorials/easy-node-authentication-setup-and-local