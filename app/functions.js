
// Loads up config for connection
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// //=================================================

var ssn;//variable of session

module.exports = {

	loginfunc: function(req, res) {
        // render the page and pass in any flash data if it exists
        if(typeof req.session.passport !== 'undefined'){
            res.redirect('/dashboard');
        }
        else{
            res.render('login.ejs', { message: req.flash('loginMessage') });
        }
    },

    profilefunc: function(req, res) {
        var userid = req.session.passport.user;
        var category = req.session.passport.category;
        connection.query("SELECT * FROM account WHERE id = ?", [userid], function(err, rows){

	        if(category == 1){
	            res.render('Profiles/user/profile_user.ejs', {
	                user : rows[0] // get the user out of session and pass to template
	            });
	        }
	        else if(category == 2){
                res.render('Profiles/dealer/profile_dealer.ejs', {
	                user : rows[0] // get the user out of session and pass to template
	            });
	        }
	        else if(category == 3){
                res.render('Profiles/admin/profile_admin.ejs', {
                    user : rows[0] // get the user out of session and pass to template
                });
	        }

        });
    },

    // route middleware to make sure
	isLoggedInfunc: function isLoggedIn(req, res, next) {
	    // if user is authenticated in the session, carry on
	    if (req.isAuthenticated())
	        return next();

	    // if they aren't redirect them to the home page
	    res.redirect('/login');
	},

	logoutfunc: function(req, res) {
        req.logout();
        req.session.destroy(function(err) {
            if(err) {
              console.log(err);
            } else {
              res.redirect('/');
            }
        });
    },

    //Fix wallet
    walletfunc: function(req, res) {
        var userid = req.session.passport.user;
        var category = req.session.passport.category;
        connection.query("SELECT * FROM account WHERE id = ?",[userid], function(err, rows){
            wallet_data = {
                user : rows[0].wallet // send balance info.
            };
            // if(category == 1){
	           // res.render('Profiles/admin/wallet.ejs', wallet_data);
            switch (category) {
                case 1:
                    res.render('Profiles/user/wallet.ejs', wallet_data);
                    break;
                case 2:
                    res.render('Profiles/dealer/wallet.ejs', wallet_data);
                    break;
                case 3:
                    res.render('Profiles/admin/wallet.ejs', wallet_data);
            }
	    });
    },



    dashboard: function(req, res){
        var userid = req.session.passport.user;
        var category;
        connection.query("SELECT * FROM account WHERE id = ?", [userid], function(err, rows){
            category = rows[0].category;
            req.session.passport.category = category;

            connection.query("SELECT * FROM all_equipment", function(err, rows){
                category = req.session.passport.category;

                if(category == 1){
                    res.render('Profiles/user/dashboard_user.ejs', {
                        user : rows // get the user out of session and pass to template
                    });
                }
                else if(category == 2){
                    res.render('Profiles/dealer/dashboard_dealer.ejs', {
                        user : rows // get the user out of session and pass to template
                    });
                }
                else if(category == 3){
                    res.render('Profiles/admin/dashboard_admin.ejs', {
                        user : rows // get the user out of session and pass to template
                    });
                }
            });
        });
    },

    //================================================================================
    //======================= ADMIN FUNCTIONS ========================================
    //================================================================================

    new_location: function(req, res) {
    	res.render('Profiles/admin/new_location.ejs', { message: req.flash('newLocationMessage') });
    },

    //improve for case
    add_new_location: function(req, res){
    	var city = req.body.city;
    	var city = city.toUpperCase();
    	connection.query("SELECT * FROM location WHERE city = ?",[city], function(err, rows) {
            if (err){
                throw err;
            }
            else if (rows.length) {
                req.flash('newLocationMessage', 'That Location already exists.');
    			res.render('Profiles/admin/new_location.ejs', { message: req.flash('newLocationMessage') });
            } else {
            	var state = req.body.state;
               	var insertQuery = "INSERT INTO location ( city, state, dealer_count, equipment_count) values (?,?,?,?)";
               	connection.query(insertQuery, [city, state, 0, 0],function (err, rows) {
				    if (err) throw err;
				    console.log("New Location Added");
				});
				res.redirect('/profile');
            }
            return ;
    	});
    },

    existing_location: function(req,res){
    	connection.query("SELECT * FROM location", function(err, rows){
    		if (err){
                throw err;
    		}
    		else if (!rows.length) {
    			req.flash('newLocationMessage', 'Please add a location to view');
    			res.render('Profiles/admin/new_location.ejs', { message: req.flash('newLocationMessage') });
    		}
    		else {
    			res.render('Profiles/admin/existing_location.ejs', {
	                    user : rows// get the user out of session and pass to template
	                });
    			console.log(rows);
    		}
    	});
    },

    existing_user: function(req,res){
    	connection.query("SELECT * FROM account", function(err, rows){
    		if (err){
                throw err;
    		}
    		else if (!rows.length) {
    			req.flash('newLocationMessage', 'Please add a location to view');
    			res.render('signup.ejs', { message: req.flash('newLocationMessage') });
    		}
    		else {
    			res.render('Profiles/admin/existing_user.ejs', {
	                    user : rows // get the user out of session and pass to template
	                });
    			console.log(rows);
    		}
    	});
    },

    add_new_admin: function(req,res){
    	connection.query("SELECT sno, city FROM location", function(err, rows){
    		if (err){
                throw err;
    		}
    		else if (!rows.length) {
    			req.flash('newLocationMessage', 'Please add a location to add a new admin');
    			res.render('Profiles/admin/new_location.ejs', { message: req.flash('newLocationMessage') });
    		}
    		else {
    			res.render('Profiles/admin/add_new_admin.ejs', {
	                    user : rows,
	                    message : "" // get the user out of session and pass to template
	                });
    			console.log(rows);
    		}
    	});
    },

    add_new_admin_post_form: function(req,res){
    	var data = req.body;
    	connection.query("SELECT * FROM account WHERE username = ?",[data.username], function(err, rows) {
            if (err)
                throw err;
            if (rows.length) {
                req.flash('signupMessage', 'That username is already taken.');
                res.render('Profiles/admin/add_new_admin.ejs', { message: req.flash('newLocationMessage') });
            } else {
   	            // if there is no user with that username
                // create the user
                var insertQuery1 = "INSERT INTO account ( username, password, category, email, mobile, wallet, address) values (?,?,?,?,?,?,?)";
                var category = 3;
                var wallet = 0;
	            connection.query(insertQuery1,[data.username, data.password, category, data.email, data.mobile, wallet, data.address], function(err, rows) {

	            	if (err){
                		throw err;
    				}
    				else {
	            	var insertQuery2 = "INSERT INTO admin ( id, location, boss_id) values (?,?,?)";
	            	connection.query(insertQuery2,[rows.insertId, data.location, req.session.passport.user], function(err, rows) {
		            	res.redirect('/profile');
	            	});
	            	}
	            });
            }
        });
    },

    add_new_equipment: function (req,res){
        res.render('Profiles/admin/add_new_equipment.ejs', {message: ''});
    },
    add_new_equipment_post_form: function(req,res){
        data = req.body;
        ini_data = {
            search_count : 0,
            view_count : 0,
            auction_count : 0
        };
        connection.query("SELECT * FROM std_equipment WHERE (asset_name = ? AND model = ?)",[data.asset_name, data.model], function(err, rows) {
            if (err){
                throw err;
            }
            else if (rows.length) {
                req.flash('newEquipmentMessage', 'That Equipment already exists.');
                res.render('Profiles/admin/add_new_equipment.ejs', { message: req.flash('newEquipmentMessage') });
            } 
            else {
                var insertQuery = "INSERT INTO std_equipment (asset_name, model, market_price, description, search_count, view_count, auction_count) values (?,?,?,?,?,?,?)";
                connection.query(insertQuery, [data.asset_name, data.model, data.market_price, data.description, ini_data.search_count, ini_data.view_count, ini_data.auction_count],function (err, rows) {
                    if (err) throw err;
                    else {
                        console.log("New Location Added");
                        res.redirect('/profile');
                    }
                });
            }
        });
    },

    add_new_auction: function(req,res){
        res.render('Profiles/admin/add_new_auction', { message: '' });
    },

    add_new_auction_post_form: function(req, res){
        var data = req.body;
        var insertQuery = "INSERT INTO auction (start_time, end_time, is_featured) values (?,?,?)";
        connection.query(insertQuery, [data.start_time, data.end_time, data.is_featured],function (err, rows) {
                if (err) throw err;
            else {
                console.log("New Auction Added");
                
                console.log(data.end_time < data.start_time);
                res.redirect('/profile');
            }
        });
    },



    //================================================================================
    //======================= Dealer FUNCTIONS =======================================
    //================================================================================

    complete_profile: function(req,res){
        connection.query("SELECT sno, city FROM location", function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.render('Profiles/dealer/complete_profile.ejs', {
                        user : rows,
                        message : "" // get the user out of session and pass to template
                    });
            }
        });
    },

    //need to remove complete my profile from
    complete_profile_post_form:  function(req,res){
        var id = req.session.passport.user;
        var data = req.body;
        ini_data = {
            deal_count : 0,
            total_asset : 0,
            req_stat : 0
        };
        console.log(ini_data);
        insertQuery = "INSERT INTO dealer ( id, location, pan_number, gst_number, deal_count, total_asset, req_stat) values (?,?,?,?,?,?,?)";
        connection.query(insertQuery,[id, data.location, data.pan_number, data.gst_number, ini_data.deal_count, ini_data.total_asset, ini_data.req_stat], function(err, rows){
            if (err){
                throw err;
            }
            else {
                console.log(rows);
                res.redirect('/profile');
            }
        });
    },

    add_car : function(req, res){
        console.log("DFGHJKHGFD");
        connection.query("SELECT id, asset_name, model FROM std_equipment", function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.render('Profiles/dealer/add_car.ejs', {
                    user : rows,
                    message : "" // get the user out of session and pass to template
                });
            }
        });
    },

    add_car_post_form:  function(req,res){
        var id = req.session.passport.user;
        var data = req.body;
        console.log(data);
        insertQuery = "INSERT INTO all_equipment (name, bought_price, year, rating, dealer, auction_para) values (?,?,?,?,?,?)";
        connection.query(insertQuery,[data.name, data.bought_price, data.year, data.rating, id, data.auction_para], function(err, rows){
            if (err){
                throw err;
            }
            else {
                console.log(rows);
                res.redirect('/profile');
            }
        });
    }
}

