
// Loads up config for connection
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

const notifier = require('node-notifier');

// connection.config.multipleStatements = true;
// console.log(connection.config.multipleStatements);

var nodemailer = require('nodemailer');
 var bcrypt = require('bcrypt-nodejs');


// //=================================================

var ssn;//variable of session
var schedule = require('node-schedule');

var express  = require('express');
var app = express();
var crypto = require('crypto');


var bid_para = 1;

// //=================================================

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
        var userid = req.session.user;
        var category = req.session.category;
        console.log(req.body.hides);
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
        //return next();
	    // if user is authenticated in the session, carry on
	    if (req.isAuthenticated()){
	        return next();
        }
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
        var userid = req.session.user;
        var category = req.session.category;
        connection.query("SELECT * FROM account WHERE id = ?",[userid], function(err, rows){
            wallet_data = {
                user : rows[0].wallet // send balance info.
            };
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
        var userid = req.session.user;
        var category = req.session.category;
        selectquery = "SELECT * FROM all_equipment where (dealer != ? AND auction_para = '1')";
        connection.query(selectquery, [userid], function(err, rows){

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
    },

    forgot: function(req, res){
        var userid = req.body.username;
        selectquery = "SELECT * from account where username = ?";
        connection.query(selectquery, [userid], function(err, rows){
            console.log(rows);

            if(err)throw err;
            else if(!rows.length){
                res.send("no user with this username exists");
            }
            else {
                genrate_mail(req, rows);
                res.send("A mail has been send to your email-id")
            }
        })
    },


    reset_pass: function(req, res) {
        selectquery = "SELECT * from account where resetPasswordToken = ? AND resetPasswordExpire > NOW()"
        connection.query(selectquery,[req.params.token], function(err, rows) {
            if (!rows.length) {
                var result = {
                    err:true,
                    msg:'Password reset token is invalid or has expired.'
                }
                return res.status(200).json(result);
            }
            var result = {
                message:"reset your password", 
                user:rows[0]
            }
            res.render('forgot-password.ejs', result);
        });
    },



    reset_pass_post_form : function(req, res){
        selectquery = "SELECT * from account where resetPasswordToken = ? AND resetPasswordExpire > NOW()";
        console.log(req.params);
        connection.query(selectquery,[req.params.token], function(err, rows) {
            if(err)throw err;
            else if(!rows.length){
                var result = {
                    msg:"this token has expired"
                }
                return res.status(200).json(result);
            }

            console.log(rows);
            console.log(req.body);
            password = bcrypt.hashSync(req.body.password, null, null)
            resetPasswordExpire = undefined;
            resetPasswordToken = undefined;
            updatequery = "UPDATE account set password = ?, resetPasswordToken = ?, resetPasswordExpire = ? WHERE username = ?";
            connection.query(updatequery, [password, resetPasswordToken, resetPasswordExpire, rows[0].username], function(err, rows){
                if(err)throw err;
                res.status(200).json({a: rows, b : " Your password has been reset."});
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
        selectquery = "select * from ( select  * FROM (select * from admin order by boss_id, id) products_sorted, (select @pv := ?) initialisation where find_in_set(boss_id, @pv) > 0 and @pv := concat(@pv, ',', id) ) a, account b where a.id = b.id";
    	connection.query(selectquery, [req.session.user], function(err, rows){
    		if (err){
                throw err;
    		}
    		else if (!rows.length) {
    			req.flash('newLocationMessage', 'No User is working Under you');
    			res.render('Profiles/admin/dashboard_admin.ejs', { message: req.flash('newLocationMessage') });
    		}
    		else {
                // showquery = "select * from account a, admin b where a.id = b.id"
                // // connection.query(showquery, [rows], function(err, rows){
                    // console.log(rows);
                    // res.status(200).json(rows);
                // });


    			res.render('Profiles/admin/existing_user.ejs', {
	                    user : rows // get the user out of session and pass to template
	                });
    		}
    	});
    },

    existing_dealers: function(req,res){
        var category = req.session.category;
        console.log(category);
        connection.query("SELECT * FROM account WHERE category = 2", function(err, rows){
            if (err){
                throw err;
            }
            else if (!rows.length) {
                req.flash('newLocationMessage', 'Please add a location to view');
                res.render('signup.ejs', { message: req.flash('newLocationMessage') });
            }
            else {
                if(category==3)
                res.render('Profiles/admin/existing_dealers.ejs', {
                        user : rows // get the user out of session and pass to template
                    });
                 if(category==2)
                res.render('Profiles/dealer/chat_dealer.ejs', {
                        user : rows // get the user out of session and pass to template
                    });
                else
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
                    console.log(rows);
	            	if (err){
                		throw err;
    				}
    				else {
	            	var insertQuery2 = "INSERT INTO admin ( id, location, boss_id) values (?,?,?)";
	            	connection.query(insertQuery2,[rows.insertId, data.location, req.session.user]);
                    connection.query("SELECT * from account WHERE username = ?", [data.username], function(err, rows){
                        genrate_mail(req, rows);
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
        var selectquery = "Select * from auction WHERE ( (? > start_time AND ? < end_time) OR (? > start_time AND ? < end_time) OR (?) )"

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
                            bid_para = 1;
                            console.log("Auction started, now bidding = " + app.settings.bid_para);

                        });

                        var auction_end_schedule = schedule.scheduleJob(data.end_time, function(){
                            console.log('The world is going to end today.');
                            bid_para = 0;
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
        res.render('Profiles/admin/enquiry_form.ejs', {message: ''});
    },

    enquiry_form_post_form : function(req, res){
        var data = req.body;
        var user = req.session.user;
        var category = req.session.category;

        selectquery = "SELECT boss_id from admin where id = ?"
        connection.query(selectquery, [user], function(err, rows){
            console.log(rows);

            connection.query("INSERT INTO enquiry (sender_id, reciever_id, description, subject) values (?,?,?,?)",[user, rows[0].boss_id, data.description, data.subject], function(err, rows){
                if(err) throw err;
                else{
                    res.render('Profiles/admin/enquiry_form.ejs', { message: 'your enquiry is submitted'});
                }
            } );
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
        var id = req.session.user;
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
                 connection.query("UPDATE location SET dealer_count=dealer_count + 1 WHERE CITY = ?",[data.location], function(err, rows){
            if (err){
                throw err;
            }
            else {
                console.log(rows);
                
                
            }
        });
                res.redirect('/profile');
            }
        });
    },

    add_car : function(req, res){
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
        var id = req.session.user;
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
        connection.query(selectQuery,[req.session.user], function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.render('Profiles/dealer/my_equipment.ejs', {user: rows, message: ''});
            }
        });
    },


    dealer_purchase: (req,res)=>{
        selectQuery = "";//to do
        // connection.query("SELECT id, asset_name, model FROM std_equipment", function(err, rows){
          //  if (err){
            //    throw err;
            //}
            //else {
                res.render('Profiles/dealer/purchase_req.ejs', {
                    user : '',
                    message : "" // get the user out of session and pass to template
                });
            //}
        //});
    },

    dealer_purchase_post_form: (req,res)=>{
        var id=req.session.user;
        var data=req.body;
        var purchaseid;

        insertQuery = "INSERT INTO purchase_details (user_id, costumer_name, contact, address) VALUES (?,?,?,?) ";
        connection.query(insertQuery,[id, data.name, data.contact, data.address], function(err, rows){
            if (err){
                throw err;
            }else{
                //TO DO
                 console.log("index  "+rows.insertId);
                 purchaseid=rows.insertId;
                    var prefQuery = "INSERT INTO purchase_pref (purchase_id, pref_1, pref_2, pref_3, pref_4, m_range) VALUES (?,?,?,?,?,?)";
        
        connection.query(prefQuery,[purchaseid, data.pref_1, data.pref_2, data.pref_3, data.pref_4, data.m_range], function(err, rows){
            if (err){
                throw err;
            }else{
                res.redirect("/profile");
            }
    });
            }
        });
            
},
        
         dealer_sell : (req, res)=>{
        
        connection.query("SELECT id, asset_name, model FROM std_equipment", function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.render('Profiles/dealer/dealer_sell.ejs', {
                    user : rows,
                    message : ""
                });
            }
        });
    },

    dealer_sell_post_form:  function(req,res){
        var id = req.session.passport.user;
        var data = req.body;
        console.log(data);
        insertQuery = "INSERT INTO all_equipment (name, bought_price, year, rating, dealer, auction_para) values (?,?,?,?,?,?)";
        connection.query(insertQuery,[data.name, data.bought_price, data.year, data.rating, id, data.auction_para], function(err, rows){
            if (err){
                throw err;//To Do: add user_name column in all_equipment table
            }
            else {
                console.log(rows);

                res.redirect('/profile');
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
        var id = req.session.user;
        if(!bid_para){
            // message to flash message that no Auction is running
            console.log('no Auction running' + bid_para);
            res.redirect('/dashboard');
        }
        else if(data.new_bid < data.next_bid){
            //message to flash that you must bid higher than mini bid
            console.log('smaller than mini bid');

            res.redirect('/dashboard');
        }
        else {
            data.equip_id = Number(data.equip_id);
            data.next_bid = Number(data.new_bid) + 1000;
            insertQuery = "INSERT INTO bids (equip_id, auction_id, buyer_id, bid_price) values (?,?,?,?)";
            connection.query(insertQuery, [data.equip_id, data.auction_id, id, data.new_bid], function(err, req, fields){
                if(err) throw err;
                else{
                    updatequery = "UPDATE all_equipment SET next_bid = ? where id = ?";
                    connection.query(updatequery, [data.next_bid, data.equip_id], function(err,req){
                        if(err) throw err;
                        else{
                        console.log(app.get('bid_para'));
                        res.redirect('/dashboard');
                        }
                    });
                }
            });
        }
    },


//=================================================================================================
    


    next_auction : (req,res)=>{
        selectquery = "SELECT * from auction WHERE end_time > NOW() ORDER BY start_time ASC";
        connection.query(selectquery, (err,rows)=>{
            if(err) throw err;
            else if(!rows.length){
                return null;
            }
            else {
                console.log(rows);
                res.render('Profiles/dealer/live_auctions.ejs', {
                    user : rows,
                    message : ""
                });
           // callback(rows);
            }
        });
    }
}





function genrate_mail(req, rows) {
    // body...

    crypto.randomBytes(20, function(err, buf){
        if(err)throw err;
        var token = buf.toString('hex');

        updatequery = "UPDATE account SET resetPasswordToken = ?, resetPasswordExpire = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE username = ?";

        connection.query(updatequery, [token, rows[0].username], function(err, rows){
            console.log(rows);
            if(err) throw err;
            else return rows;
            });


        var smtpTransport = nodemailer.createTransport({
            host:'smtp.ethereal.email',
            port: 587,
            auth:{
                user:'c74kurqre2vnhdim@ethereal.email',
                pass:'X3Msz17xGCs2AA2sBA'
            }
        });

        var mailOptions = {
            to:rows[0].email,
            from:'passwordreset@demo.com',
            subject:'Auction password reset',
            text:'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions);
        console.log('MAIL SEND');
    });
}
