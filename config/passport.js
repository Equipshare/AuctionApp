// config/passport.js

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
    // LOCAL SIGNUP 
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password
            usernameField : 'mobile',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
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

                    var insertQuery = "INSERT INTO account (first_name, last_name, middle_name, city, state, country, zipcode, pan_number, password, category, email, mobile, wallet, address) values (?,?,?,?,?,?, ?, ?, ?,?,?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.first_name, newUserMysql.last_name, newUserMysql.middle_name, newUserMysql.city, newUserMysql.state, newUserMysql.country, newUserMysql.zipcode, newUserMysql.pan_number, newUserMysql.password, newUserMysql.category, newUserMysql.email, newUserMysql.mobile, newUserMysql.wallet, newUserMysql.address],function(err, rows) {
                        if(err){
                            console.log('$'+newUserMysql.mobile+'$')
                            return done(err);
                        }
                        else{
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
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'mobile',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form

            connection.query("SELECT * FROM account WHERE mobile = ?",[username], function(err, rows){
                console.log("Username: " + username);
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, "No user found"); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, "Oops! Wrong password"); // create the loginMessage and save it to session as flashdata

                req.session.user = rows[0].id;
                req.session.category = rows[0].category;

                // all is well, return successful user
                category = rows[0].category;
                return done(null, rows[0], "Welcome");
            });
        })
    );
};
