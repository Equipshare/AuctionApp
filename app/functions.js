
// Loads up config for connection
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection, {multipleStatements: true});

connection.query('USE ' + dbconfig.database);
// connection.config.multipleStatements = true;
// console.log(connection.config.multipleStatements);

// //=================================================

var ssn;//variable of session
var schedule = require('node-schedule');
var moment = require('moment');

var express  = require('express');
var app = express();


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

            selectquery = "SELECT * FROM all_equipment where (dealer != ? AND auction_para = '1')";
            connection.query(selectquery, [userid], function(err, rows){
                category = req.session.passport.category;
                console.log()
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
        res.render('Profiles/admin/add_new_auction.ejs', { message: '' });
    },

    add_new_auction_post_form: function(req, res){
        var data = req.body;
        var selectquery = "Select * from auction WHERE ( (? > start_time AND ? < end_time) OR (? > start_time AND ? < end_time) )"

        connection.query(selectquery,[data.start_time, data.start_time, data.end_time, data.end_time], function(err, rows){
            console.log(rows);
            if(err) throw err;
            else if(rows.length){
                req.flash('newAuctionMessage', 'That Auction Timings clashes with another Auction');
                res.render('Profiles/admin/add_new_auction.ejs', { message: req.flash('newAuctionMessage') });
            }
            else {
                var insertQuery = "INSERT INTO auction (start_time, end_time, is_featured) values (?,?,?)";
                connection.query(insertQuery, [data.start_time, data.end_time, data.is_featured],function (err, rows) {
                        if (err) throw err;
                    else {
                        console.log("New Auction Added");

                        //Schedule task here;
                        var auction_start_schedule = schedule.scheduleJob(data.start_time, function(){
                            console.log('The world is going to end today.');
                            app.set('bid_para', 1);
                            console.log("Auction started, now bidding = " + app.settings.bid_para);

                        });

                        var auction_end_schedule = schedule.scheduleJob(data.end_time, function(){
                            console.log('The world is going to end today.');
                            app.set('bid_para', 0);
                            console.log("Auction ended, now bidding = " + app.settings.bid_para);

                            // ADD ALLOCATION TO AUCTION
                        });


                        res.redirect('/dashboard');
                    }
                });
            }
        });
    },

    enquiry_form: function(req, res){
        res.render('/Profiles/admin/enquiry_form.ejs');
    },

    enquiry_form_post_form : function(req, res){
        
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
    },

    dealer_my_equipment: function(req,res){
        selectQuery = "select * from all_equipment where dealer = ?";
        connection.query(selectQuery,[req.session.passport.user], function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.render('Profiles/dealer/my_equipment.ejs', {user: rows, message: ''});
            }
        });
    },

    change_auction_status: function(req, res){
        var data = req.body;
        if(data.mini_bid == ''){
            data.mini_bid = 0;
        }

        next_auction( function(result) {
            console.log(result);
            updatequery = "UPDATE all_equipment SET auction_para = NOT auction_para, auction = ?, mini_bid = ?, next_bid = ? where id = ?";
            connection.query(updatequery, [result[0].id, data.mini_bid, data.mini_bid, data.id], function(err, rows){
                if (err){
                    throw err;
                }
                else {
                    res.redirect('/dealer_my_equipment');
                }
            });
        });
    },

    //================================================================================
    //======================= General FUNCTIONS ======================================
    //================================================================================

    add_new_bid: function(req, res){
        data = req.body;
        console.log(data);
        var id = req.session.passport.user;
        if(!app.get('bid_para')){
            // message to flash message that no Auction is running
            res.redirect('/dashboard');
        }
        else if(data.new_bid < data.mini_bid){
            //message to flash that you must bid higher than mini bid
            res.redirect('/dashboard');
        }
        else {
            data.equip_id = Number(data.equip_id);
            data.next_bid = Number(data.new_bid) + 1000;
            console.log(connection.config.multipleStatements);
            insertQuery = "INSERT INTO bids (equip_id, auction_id, buyer_id, bid_price) values (?,?,?,?)";
            connection.query(insertQuery, [data.equip_id, data.auction_id, id, data.new_bid], function(err, req, fields){
                if(err) throw err;
                else{
                    updatequery = "UPDATE all_equipment SET next_bid = ? where id = ?"
                    connection.query(updatequery, [data.next_bid, data.equip_id], function(err,req){
                        
                        console.log(app.get('bid_para'));
                        res.redirect('/dashboard');
                    });
                }
            });
        }
    }
}

//=================================================================================================


function next_auction(callback){
    selectquery = "SELECT * from auction WHERE start_time > NOW() ORDER BY start_time ASC";
    connection.query(selectquery, function(err,rows){
        if(err) throw err;
        else if(!rows.length){
            return null;
        }
        else {
            callback(rows);
        }
    });
}

