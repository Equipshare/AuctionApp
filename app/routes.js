// app/routes.js

var functions = require('./functions')


// var dbconfig = require('./../config/database');
// var connection = mysql.createConnection(dbconfig.connection);

// connection.query('USE ' + dbconfig.database);
// ==========================================
module.exports = function(app, passport) {

    // HOME PAGE
    app.get('/',functions.isLoggedInfunc, function(req, res) {
        console.log(req.session);
        res.send("Hello, Welcome");
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
                return res.send(info);
            }

            //this is when login is successful
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
            
        })(req,res,next),
        function(req, res) {
            console.log("hello");
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
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // PROFILE SECTION =====================
    app.get('/profile', functions.isLoggedInfunc, functions.profilefunc); // issLoggedIn verifies that user is authenticated

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


    //================================================================================
    //======================= ADMIN ROUTES ===========================================
    //================================================================================

    app.get('/new_location', functions.isLoggedInfunc, functions.new_location);
    app.post('/new_location', functions.isLoggedInfunc, functions.add_new_location);
    app.get('/existing_location', functions.isLoggedInfunc, functions.existing_location);
    app.get('/existing_user', functions.isLoggedInfunc, functions.existing_user);
    app.get('/add_new_admin', functions.isLoggedInfunc, functions.add_new_admin);
    app.post('/add_new_admin', functions.isLoggedInfunc, functions.add_new_admin_post_form);
    app.get('/add_new_equipment', functions.isLoggedInfunc, functions.add_new_equipment);
    app.post('/add_new_equipment', functions.isLoggedInfunc, functions.add_new_equipment_post_form);
    app.get('/add_new_auction', functions.isLoggedInfunc, functions.add_new_auction);
    app.post('/add_new_auction', functions.isLoggedInfunc, functions.add_new_auction_post_form);
    app.get('/existing_dealers', functions.isLoggedInfunc, functions.existing_dealers);
    app.post('/existing_dealers', functions.isLoggedInfunc, functions.existing_dealers);
    app.get('/enquiry_form', functions.isLoggedInfunc, functions.enquiry_form);
    app.post('/enquiry_form', functions.isLoggedInfunc, functions.enquiry_form_post_form);


    //================================================================================
    //======================= DEALER ROUTES ==========================================
    //================================================================================

    app.get('/complete_profile', functions.isLoggedInfunc, functions.complete_profile);
    app.post('/complete_profile', functions.isLoggedInfunc, functions.complete_profile_post_form);
    app.get('/add_car', functions.isLoggedInfunc, functions.add_car); 
    app.post('/add_car', functions.isLoggedInfunc, functions.add_car_post_form);
    app.get('/dealer_my_equipment', functions.isLoggedInfunc, functions.dealer_my_equipment); 
    app.post('/change_auction_status', functions.isLoggedInfunc, functions.change_auction_status);
    app.get('/dealer_purchase', functions.isLoggedInfunc, functions.dealer_purchase);
    app.post('/dealer_purchase',functions.isLoggedInfunc, functions.dealer_purchase_post_form);
    app.get('/dealer_sell', functions.isLoggedInfunc, functions.dealer_sell);
    app.post('/dealer_sell', functions.isLoggedInfunc, functions.dealer_sell_post_form);
    app.get('/next_auction', functions.isLoggedInfunc, functions.next_auction);
    //app.post('/next_auction',functions.isLoggedInfunc, functions.dashboard);


    app.get('/notify', functions.isLoggedInfunc, function(req, res){
        console.log(req.session);
        res.send(req.session);
    });
    //================================================================================
    //======================== General Routes ========================================
    //================================================================================

    app.post('/add_new_bid', functions.isLoggedInfunc, functions.add_new_bid);




    

}