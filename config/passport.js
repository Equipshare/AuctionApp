// config/passport.js
// functions for signup and login


// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup 
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM account WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // SIGNUP 
    // =========================================================================

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username as mobile-number and password
            usernameField : 'mobile',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        // functions called on signup.
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM account WHERE mobile = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, {usrmsg: 'That username is already taken'});
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        middle_name: req.body.middle_name,
                        city: req.body.city,
                        state: req.body.state,
                        country: req.body.country,
                        zipcode: req.body.zipcode,
                        pan_number: req.body.pan_number,
                        password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
                        category: req.body.category,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        address: req.body.address,
                        wallet: 0
                    };

                    // insert the data into the db-table account
                    var insertQuery = "INSERT INTO account (first_name, last_name, middle_name, city, state, country, zipcode, pan_number, password, category, email, mobile, wallet, address) values (?,?,?,?,?,?, ?, ?, ?,?,?,?,?,?)";

                    // make a query
                    connection.query(insertQuery,[newUserMysql.first_name, newUserMysql.last_name, newUserMysql.middle_name, newUserMysql.city, newUserMysql.state, newUserMysql.country, newUserMysql.zipcode, newUserMysql.pan_number, newUserMysql.password, newUserMysql.category, newUserMysql.email, newUserMysql.mobile, newUserMysql.wallet, newUserMysql.address],function(err, rows) {
                        if(err){// if error occurs
                            console.log('$'+newUserMysql.mobile+'$')
                            return done(err);
                        }
                        else{
                        //else add data in session, and return id.
                        newUserMysql.id = rows.insertId;
                        req.session.user = newUserMysql.id;
                        req.session.category = newUserMysql.category;
                        return done(null, newUserMysql);
                        }
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN
    // =========================================================================


    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'mobile',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        // function for login
        function(req, username, password, done) { // callback with email and password from our form
            // select if account exists.
            connection.query("SELECT * FROM account WHERE mobile = ?",[username], function(err, rows){
                console.log("Username: " + username);
                if (err) // if error occurs
                    return done(err);
                if (!rows.length) { // if there is no rows selected, i.e. no user is there, then
                    return done(null, false, "No user found"); 
                }
                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, "Oops! Wrong password"); //send error message to client
                //otherwise, add data to session.
                req.session.user = rows[0].id;
                req.session.category = rows[0].category;

                // if all is well, then return "Welcome" after saving data to session
                category = rows[0].category;
                return done(null, rows[0], "Welcome");
            });
        })
    );
};
