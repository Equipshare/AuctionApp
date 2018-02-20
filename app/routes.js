// app/routes.js

//load all the things needed.
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


var express  = require('express');
var app = express();

// import functions from other files.
var functions = require('./functions');
var functions_admin = require('./functions_admin');
var functions_dealer = require('./functions_dealer');

// ==========================================
module.exports = function(app, passport) {

    // HOME PAGE
    app.get('/', functions.isLoggedInfunc, function(req, res) {
        console.log("Logged in with id: " + req.session.user);
        connection.query("SELECT first_name from account where id = ?", [req.session.user], function(err,rows){
            data = {
                id: req.session.user,
                name: rows[0].first_name,
                msg: "Hello, Welcome"
            };
            res.send({msg: data});
        });
    });

    // LOGIN
    // show the login form or redirct to profile if already logged in
    app.get('/login', functions.loginfunc);

    // process the LOGIN form
    app.post('/login', function(req, res, next){
        passport.authenticate('local-login', function (err, user, info) {
            //this function is called when LocalStrategy returns done function with parameters

            //if any error , throw error to default error handler
            if(err) throw err;

            //if username or password doesn't match
            if(!user){
                return res.send({msg: info});
            }

            //this is when login is successful
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
            
        })(req,res,next),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
        }
    });

    // SIGNUP ==============================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', function(req, res, next){
        passport.authenticate('local-signup', function (err, user, info) {
            //this function is called when LocalStrategy returns done function with parameters

            //if any error , throw error to default error handler
            if(err) throw err;

            //if username or password doesn't match
            if(!user){
                return res.send({msg: info});
            }

            //this is when login is successful
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
            
        })(req,res,next),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
        }
    })

    // PROFILE SECTION =====================
    app.get('/profile/:id', functions.isLoggedInfunc, functions.profilefunc); // issLoggedIn verifies that user is authenticated

    // LOGOUT ==============================
    app.get('/logout', functions.logoutfunc);
    // =====================================

    app.get('/dashboard', functions.isLoggedInfunc, functions.dashboard);

    app.get('/wallet',functions.isLoggedInfunc, functions.walletfunc);

    //this is post for forgot password which requires user's email id
    app.post('/forgot', functions.forgot);

    //this route will verify the password token hasn't expire and returns a json response
    app.get('/reset/:token', functions.reset_pass);

    //POST for password reset and if token hasn't expired, the password of user is reset.
    app.post('/reset/:token', functions.reset_pass_post_form);

    app.post('/add_to_likes', functions.isLoggedInfunc, dealer_user_access, functions.add_to_likes);

    app.post('/search_suggestions', functions.isLoggedInfunc, dealer_user_access, functions.search_suggestions);

    app.post('/search', functions.isLoggedInfunc, dealer_user_access, functions.search);

    app.get('/my_likes', functions.isLoggedInfunc, dealer_user_access, functions.my_likes);    

     app.get('/show_car/:id', functions.isLoggedInfunc, functions.show_car);

    //================================================================================
    //======================= ADMIN ROUTES ===========================================
    //================================================================================


    app.post('/admin/new_location', functions.isLoggedInfunc, admin_access, functions_admin.add_new_location);
    app.get('/admin/existing_location', functions.isLoggedInfunc, admin_access, functions_admin.existing_location);
    app.get('/admin/existing_user', functions.isLoggedInfunc, admin_access, functions_admin.existing_user);
    app.get('/admin/add_new_admin', functions.isLoggedInfunc, admin_access, functions_admin.add_new_admin);
    app.post('/admin/add_new_admin', functions.isLoggedInfunc, admin_access, functions_admin.add_new_admin_post_form);
    app.post('/admin/add_new_equipment', functions.isLoggedInfunc, admin_access, functions_admin.add_new_equipment_post_form);
    app.post('/admin/add_new_auction', functions.isLoggedInfunc, admin_access, functions_admin.add_new_auction_post_form);

    app.get('/existing_dealers', functions.isLoggedInfunc, functions.existing_dealers);    //common for admin and dealer

    app.post('/admin/enquiry_form', functions.isLoggedInfunc, admin_access, functions_admin.enquiry_form_post_form);
    app.post('/admin/change_time', functions.isLoggedInfunc, admin_access, functions_admin.change_time);
    app.get('/pending_request', functions.isLoggedInfunc, admin_access, functions_admin.pending_request);
    app.post('/verified', functions.isLoggedInfunc, admin_access, functions_admin.verified);

    //================================================================================
    //======================= DEALER ROUTES + USER ROUTES ============================
    //================================================================================

    app.get('/dealer/complete_profile', functions.isLoggedInfunc, dealer_access, functions_dealer.complete_profile);
    app.post('/dealer/complete_profile', functions.isLoggedInfunc,  dealer_access, functions_dealer.complete_profile_post_form);
    app.get('/add_car', functions.isLoggedInfunc, dealer_user_access, functions.add_car); 
    app.post('/add_car', functions.isLoggedInfunc, dealer_user_access,  functions.add_car_post_form);
    app.get('/dealer_my_equipment', functions.isLoggedInfunc, dealer_user_access,  functions.dealer_my_equipment); 
    app.post('/change_auction_status', functions.isLoggedInfunc, dealer_user_access,  functions.change_auction_status);
    app.get('/dealer/dealer_purchase', functions.isLoggedInfunc, dealer_access,  functions_dealer.dealer_purchase);
    app.post('/dealer/dealer_purchase',functions.isLoggedInfunc, dealer_access,  functions_dealer.dealer_purchase_post_form);
    app.get('/dealer/dealer_sell', functions.isLoggedInfunc, dealer_access,  functions_dealer.dealer_sell);
    app.post('/dealer/dealer_sell', functions.isLoggedInfunc, dealer_access,  functions_dealer.dealer_sell_post_form);
    app.get('/dealer/sell_lead', functions.isLoggedInfunc, dealer_access, functions_dealer.sell_lead);
    app.post('/dealer/schedule', functions.isLoggedInfunc, dealer_access, functions_dealer.schedule);
    app.get('dealer//my_schedule', functions.isLoggedInfunc, dealer_access, functions_dealer.my_schedule);

    app.get('/next_auction', functions.isLoggedInfunc, dealer_user_access,  functions.next_auction);
    app.get('/my_bids', functions.isLoggedInfunc, dealer_user_access,  functions.my_bids);


    //app.get('/deal', 
    //================================================================================
    //======================== General Routes ========================================
    //================================================================================

    app.post('/add_new_bid', functions.isLoggedInfunc,dealer_user_access, functions.add_new_bid);


    // // TEMPORARY routes =================================================================

    app.get('/temp', function (req, res){
        // for temporary use
        query = "SHOW DATABASES";
        connection.query(query, function(err, rows){
            res.send(rows);
        });
    });
    // app.post('/temp', function(req, res){
    //     console.log(req.body);
    //     res.send(req.body);
    // });
}


var dealer_access = function access(req,res,next){
    if(req.session.category==2) return next();
    return res.render("Profiles/dealer/error.ejs");
}

var admin_access = function access(req,res,next){
    if(req.session.category==3) return next();
    return res.render("Profiles/dealer/error.ejs");
}

var dealer_user_access = function access(req,res,next){
    if(req.session.category==1 || req.session.category ==2) return next();
    return res.render("Profiles/dealer/error.ejs");
}    