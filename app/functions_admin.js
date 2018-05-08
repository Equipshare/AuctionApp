// Admin routes functions


// load all the things we need.
var functions = require('./functions');
var others = require('./others');

var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

// ========================================================

var schedule = require('node-schedule');

var express  = require('express');
var app = express();

// ================== DAILY AUCTION TIME ===================

// Should have placed in databse table
var DAST = "15:00:00"; // Daily auction start time
var DAET = "20:00:00"; // Daily auction end time

// =========================================================

module.exports = {

	//================================================================================
    //======================= ADMIN FUNCTIONS ========================================
    //================================================================================

    //Handle POST request to add a new working location 
    //
    add_new_location: function(req, res){
    	var city = req.body.city;
    	var city = city.toUpperCase(); // Change CASE to uppercase for handling case-coflicts while comparing

    	connection.query("SELECT * FROM location WHERE city = ?",[city], function(err, rows) {
            if (err){
                throw err;
            }
            else if (rows.length) {
                req.send("That Location already exists");
            } else {
            	var state = req.body.state;
               	var insertQuery = "INSERT INTO location ( city, state, dealer_count, equipment_count) values (?,?,?,?)";
                // insert with initial deal_count, equipment_count to zero
               	connection.query(insertQuery, [city, state, 0, 0],function (err, rows) {
				    if (err) throw err;
				    console.log("New Location Added");
				});

				res.send("New Location Added");
            }
            return ;
    	});
    },

    // Show existing locations
    existing_location: function(req,res){
    	connection.query("SELECT * FROM location", function(err, rows){
    		if (err){
                throw err;
    		}
            // if there is no locations
    		else if (!rows.length) {
    			res.send("Please add a location to view"); 
    		}
    		else {
    			res.send(rows);
    		}
    	});
    },

    // Show all the sub-Admin working under the particuler logged in admin.
    existing_user: function(req,res){
        //query for searching from tree like stucture.
        selectquery = "select * from ( select  * FROM (select * from admin order by boss_id, id) products_sorted, (select @pv := ?) initialisation where find_in_set(boss_id, @pv) > 0 and @pv := concat(@pv, ',', id) ) a, account b where a.id = b.id";
    	connection.query(selectquery, [req.session.user], function(err, rows){
    		if (err){
                throw err;
    		}
    		else if (!rows.length) {
    			req.send("No User is working Under you");
    		}
    		else {
    			res.send(rows);
    		}
    	});
    },

    // Handle get request and give all locations for drop-down for adding new admin
    add_new_admin: function(req,res){
    	connection.query("SELECT sno, city FROM location", function(err, rows){
    		if (err){
                throw err;
    		}
    		else if (!rows.length) {
    			res.send('Please add a location to add a new admin');
    		}
    		else {
    			res.send(rows);
    		}
    	});
    },

    // Add a new admin under an admin and send a mail for resetting the password;
    add_new_admin_post_form: function(req,res){
    	var data = req.body;
        // if 
    	connection.query("SELECT * FROM account WHERE mobile = ?",[data.mobile], function(err, rows) {
            if (err)
                throw err;
            if (rows.length) {
                req.send("That mobile is already taken");
            } else {
   	            // if there is no user with that mobile number then create the user
                // insert data into account table
                var insertQuery1 = "INSERT INTO account ( mobile, email, mobile, wallet, address) values (?,?,?,?,?,?,?)";
                var category = 3;
                var wallet = 0;
	            connection.query(insertQuery1,[data.mobile, data.email, data.mobile, wallet, data.address], function(err, rows) {
                    console.log(rows);
	            	if (err){
                		throw err;
    				}
    				else {
                    // insert data into admin table 
	            	var insertQuery2 = "INSERT INTO admin ( id, location, boss_id) values (?,?,?)";
	            	connection.query(insertQuery2,[rows.insertId, data.location, req.session.user]);
                    connection.query("SELECT * from account WHERE mobile = ?", [data.mobile], function(err, rows){
                        // generate mail to send to the email for reseting password
                        others.generate_mail(req, rows); // generate mail to verify account.
                        res.send("Mail Send to, Tell other admin to change password in an hour");
                    });
	            	}
	            });
            }
        });
    },
    
    // Handle post request to handle addition of standard equipment.
    add_new_equipment_post_form: function(req,res){
        data = req.body;
        var name = {};
        name.brand = data.brand;
        delete data["brand"];
        name.model = data.model;
        delete data["model"];
        name.varient = data.varient;
        delete data["varient"];
        var description = data.description;
        delete data["description"];
        data =JSON.stringify(data);

        // Check if equipment doesn't already exist.
        connection.query("SELECT * FROM std_equipment WHERE (brand = ? AND model = ? AND varient = ?)",[name.brand, name.model, name.varient], function(err, rows) {
            if (err){
                throw err;
            }
            else if (rows.length) {
                req.send("That Equipment already exists");
            } 
            else {
                var insertQuery = "INSERT INTO std_equipment (brand, model, varient, details, description, search_count, view_count, auction_count) values (?,?,?,?,?,?,?,?)";
                connection.query(insertQuery, [name.brand, name.model, name.varient, data, description, 0, 0, 0],function (err, rows) {
                    if (err) throw err;
                    else {
                        res.send("Added new Equipment");
                    }
                });
            }
        });
    },

    add_new_equipment_by_csv: function(req, res){
        //
        // need to doo this.
        //
        //
        //
    },

    // add new auction of D->C andd C->C type
    add_new_auction_post_form: function(req, res){
        var data = req.body;
        console.log(data);
        //Check if auction_timings does'nt clashes with already scheduled auction.
        var selectquery = "Select * from auction WHERE ( (type = ?) AND ( ( (start_time <= ? ) AND (? <= end_time) ) OR ( (start_time <= ? ) AND (? <= end_time) ) OR ( (? <= start_time) AND (? >= end_time) ) ) )"
        
        connection.query(selectquery,[2, data.start_time, data.start_time, data.end_time, data.end_time, data.start_time, data.end_time], function(err, rows){
            if(err) throw err;
            else if(rows.length){
                res.send('That Auction Timings clashes with another Auction');
                console.log(rows);
            }
            else{
                // Insert to auction table
                var insertQuery = "INSERT INTO auction (start_time, end_time, type) values (?,?,?)";
                connection.query(insertQuery, [data.start_time, data.end_time, 2],function (err, rows) {
                    if (err) throw err;
                    else {
                        // Customer to customer auction, Dealer to customer auction etc..
                        console.log("New C->C + D->C Auction Added with start_time: " + data.start_time + " and end_time: " + data.end_time);

                        var upcoming_auction = functions.next_upcoming_auction(2);

                        if(!upcoming_auction){
                            //console.log("no_users");
                            res.send("New Auction Added");
                        }
                        else {
                            // Allocate cars to next_upcoming auction.
                            connection.query("UPDATE all_equipment SET auction = ? WHERE (auction_para = ?)", [upcoming_auction, 2], function(err, rows){
                                console.log("ALLOTED AUCTIONS");
                                res.send("New Auction Added");
                            });
                            // functions.insert_object(2);
                            // res.send("New Auction Added");
                        }
                    }
                });
            }
        });
    },


    // Add enquiry and send it to next higher admin
    enquiry_form_post_form : function(req, res){
        var data = req.body;
        var user = req.session.user;
        var category = req.session.category;

        // Select boss_id from admin
        selectquery = "SELECT boss_id from admin where id = ?"
        connection.query(selectquery, [user], function(err, rows){
            console.log(rows);

            // Add data to enquiry table.
            // need an API to retrieve data drom this.
            connection.query("INSERT INTO enquiry (sender_id, reciever_id, description, subject) values (?,?,?,?)",[user, rows[0].boss_id, data.description, data.subject], function(err, rows){
                if(err) throw err;
                else{
                    res.send("your enquiry is submitted");
                }
            } );
        });
    },



    //Schedule for scheduling daily auction C->D auctions
    schedule_auction : function(){
        // config things that we need
        var rule = new schedule.RecurrenceRule();
        rule.dayOfWeek = [new schedule.Range(0, 6)];
        rule.hour = 1;
        rule.minute = 0;
        today_date =  new Date();

        // convert date time to correct format.
        var start_time = today_date.getFullYear() + '-' + today_date.getMonth() + '-' + today_date.getDate() + 'T' + DAST;
        var end_time = today_date.getFullYear() + '-' + today_date.getMonth() + '-' + today_date.getDate() + 'T' + DAET;

        console.log('node-schedule is running');

        //schedule job at 1:00AM daily to schdule a C->D auction
        var j = schedule.scheduleJob(rule, function(){
            addquery = "INSERT INTO auction (start_time, end_time, type) values (?,?,?)"
            connection.query(addquery, [start_time, end_time, 1], function(err, rows){
                if (err) throw err;
                else{
                    console.log("New Auction Added");
                    //call this function to add at the end of auction
                    module.exports.end_schedule(rows.insertId, end_time);
                }
            });
        });
    },

    // Things to do at the end of the auction
    // NEED VERY MUCH UPDATION
    end_schedule : function(auction_id, end_time){

        var j = schedule.scheduleJob(end_time, function(){
            //insert all data into auction_bid after the auction
            selectquery = "INSERT INTO auction_object (id, equip_id, auction_id, buyer_id, maxi_bid, time, mini_bid) (select a.*, b.mini_bid from (SELECT b.* from (SELECT equip_id, MAX(bid_price) AS bid_price FROM bids where auction_id = ? GROUP BY equip_id) a, bids b where a.equip_id = b.equip_id AND a.bid_price = b.bid_price and auction_id = ?) a, all_equipment b where a.equip_id = b.id OR (b.mini_bid = b.next_bid AND auction = ?) )";


            connection.query(selectquery, [auction_id, auction_id, auction_id], function(err, rows){
                if(err) throw err;
                else {
                    console.log("Insert in auction_aubject completed");
                }
            });

            // Update action_para to 4 if someone has bidded else change it to 0
            updatequery = "update all_equipment set auction_para = CASE WHEN mini_bid = next_bid THEN '0' ELSE '4' END WHERE auction = ?"
            connection.query(update,)

            res.end("Auction Ended", [auction_id], function(err, rows){
                if(err) throw err;
                else {
                    console.log("updated auction_para");
                }
            });

        });
    },

    // change time of daily auctions
    change_time : function (req, res){
    	DAST = req.body.start_time;   //this is type = "time"
    	DAET = req.body.end_time;
    },

    // see all pending delar verifications
    pending_request: function(req, res){
        // join for selecting data from both tables
        connection.query(selectquery = "SELECT * (Select * FROM dealer where is_authenthcated = ?) a, account b where a.id = b.id",[0], function(err, rows){
            if (err) throw err;
            else{
                res.send(rows);
            }
        });
    },

    // change dealer verfication status when verified
    verified : function(req, res){
        connection.query("update dealer set is_authenthcated = ? where id = ?", [1, req.body.id], function(req, res){
            if(err) throw err;
            else res.send("Dealer is verified");
        });
    }

}