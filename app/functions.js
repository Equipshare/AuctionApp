
// general functions/API for routes.

// Loads up config for connection
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

const notifier = require('node-notifier');

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

var others = require('./others');

module.exports = {

    // when succesfull login
	loginfunc: function(req, res) {
        res.send({msg: "WELCOME PLEASE LOGIN"});
    },


    // sends user data according to category
    // send data for profile
    profilefunc: function(req, res) {
        var userid = req.session.user;
        var category = req.session.category;
        var data_id = req.params.id;
        var profile = {};
        connection.query("SELECT * FROM account WHERE id = ?", [data_id], function(err, rows){
            if(data_id == userid){
                profile.status = "same";
            }
            else {
                profile.status = "other";
            }
            profile.data = rows[0];
            res.send(profile);

        });
    },

    // route to check that the client is logged in
	isLoggedInfunc: function isLoggedIn(req, res, next) {
        //return next();
        
	    // if user is authenticated in the session, carry on
	    if (req.isAuthenticated()){
	        return next();
        }
        else {
            res.redirect('/login');
        }
	    // if they aren't redirect them to the home page

	},


    // Ends current session
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
    // for wallet data.
    walletfunc: function(req, res) {
        var userid = req.session.user;
        var category = req.session.category;
        connection.query("SELECT * FROM account WHERE id = ?",[userid], function(err, rows){
            wallet_data = {
                wallet_balance : rows[0].wallet, // send balance info.
                user: userid,
                category : category
            };
            // data according to category // can remove switch and just send wallet data.
            switch (category) {
                case 1:
                    res.send(wallet_data);
                    break;
                case 2:
                    res.send(wallet_data);
                    break;
                case 3:
                    res.send(wallet_data);
            }
	    });
    },

    // dashbord api -- need to fix this according to the front-end #CALL_FRONT-END_GUY
    dashboard: function(req, res){
        var userid = req.session.user;
        var category = req.session.category;
        // send details accoriding to some prefrences and sorting.
        // formula: likes - age_of_car + bought_price/100000
        // auction_para decides various conditions onwho can buy which car.
        // some complex thing is there like customer can't buy a car in dealer auction etc. contact chitransh sir or front-end 
        // guy for final details and do changes here.
        selectquery = "SELECT * FROM all_equipment where (dealer != ? AND ( ( (? = '1') AND (auction_para = '2' ) ) OR ( (? = '2') AND  ( (auction_para = '1') OR (auction_para = '3') ) ) ) ) ORDER BY (likes - (YEAR(CURDATE()) - year) + (bought_price/100000) ) DESC";
        connection.query(selectquery, [userid, category, category], function(err, rows){
            if(category == 1 || category == 2){
                res.send({
                    id : req.session.user,
                    car_data : rows // get the user out of session and pass to template
                });
            }
            else if(category == 3){
                res.send({
                    id : req.session.user,
                    car_data : rows // get the user out of session and pass to template
                });
            }
        });
    },

    // send a car details
    show_car: (req,res)=>{
        var car_id=req.params.id;
        var user_id=req.session.user;
        var car={};
        // select using car id
        connection.query("SELECT * FROM all_equipment WHERE id = ?",[car_id],(err,rows)=>{
            if(err)
                throw err;
            else{
                if(rows.length!==0)
                {
                    if(rows[0].dealer==user_id) // if car belong to the same user
                    {
                        car.status="self"; 
                    }
                    else
                    {
                        car.status="other";
                    }
                    car.data=rows[0];
                    res.send(car);
                }
                else
                    res.send({msg: "CAR NOT FOUND"});    
                }
            });
        },

    // forgot password  API
    forgot: function(req, res){
        var userid = req.body.mobile;
        selectquery = "SELECT * from account where mobile = ?"; 
        connection.query(selectquery, [userid], function(err, rows){

            if(err)throw err;
            else if(!rows.length){ // if no user is there with particular mobile number
                res.send({msg: "no user with this mobile exists"});
            }
            else {
                // else generate mail. see generate mail in others.js
                others.generate_mail(req, rows);
                res.send({msg: "A mail has been send to your registered email-id"})
            }
        })
    },

    // reset password with the new password provided.
    reset_pass: function(req, res) {
        //select those row if the token is not expired
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
                user:rows[0] // can remove this-#CALL_FRONT-END-GUY
            }
            res.send(result);
        });
    },

    // proces the post form, also check the password-expire_token
    reset_pass_post_form : function(req, res){
        selectquery = "SELECT * from account where resetPasswordToken = ? AND resetPasswordExpire > NOW()";
        connection.query(selectquery,[req.params.token], function(err, rows) {
            if(err)throw err;
            else if(!rows.length){
                var result = {
                    msg:"this token has expired"
                }
                return res.status(200).json(result);
            }

            password = bcrypt.hashSync(req.body.password, null, null);
            resetPasswordExpire = undefined;
            resetPasswordToken = undefined;
            // Update the given password.
            updatequery = "UPDATE account set password = ?, resetPasswordToken = ?, resetPasswordExpire = ? WHERE mobile = ?";
            connection.query(updatequery, [password, resetPasswordToken, resetPasswordExpire, rows[0].mobile], function(err, rows){
                if(err)throw err;
                res.status(200).json({data: rows, message : " Your password has been reset."});
            });
        });
    },

    // when admin wants to see all users + dealers
    existing_dealers: function(req,res){
        var category = req.session.category;
        connection.query("SELECT * FROM account WHERE category = 2", function(err, rows){
            if (err){
                throw err;
            }
            else if (!rows.length) {
                req.send("Please add a location to view");
            }
            else {
                if(category== 3 || category == 2){
                    res.send(rows); 
                }
                else res.send({msg: "Not found"});
            }
        });
    },

    // send list of all cars currently- change is there to send data for selecting add car
    add_car : function(req, res){
        connection.query("SELECT id, asset_name, model FROM std_equipment", function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.send({
                    user : rows
                });
            }
        });
    },

    // post-form handler for adding car by dealer and user
    add_car_post_form:  function(req,res){
        var id = req.session.user;
        var data = req.body;
        insertQuery = "INSERT INTO all_equipment (name, bought_price, year, rating, dealer, auction_para) values (?,?,?,?,?,?)";
        connection.query(insertQuery,[data.name, data.bought_price, data.year, data.rating, id, data.auction_para], function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.redirect('/profile'); // currently redirecting to profile, call the front end guy for where he is doing now.
            }
        });
    },

    // all equipments of dealer
    dealer_my_equipment: function(req,res){
        selectQuery = "select * from all_equipment where dealer = ?";
        connection.query(selectQuery,[req.session.user], function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.send(rows);
            }
        });
    },

    // change auction status i.e. auction para -- THE complex thing i was talking about in dashbord API.
    // Contact sir for more info on what the constraints in who can buy which auction's car.
    change_auction_status: function(req, res){
        var data = req.body;   // get category and mini bid from form
        if(data.mini_bid == ''){
            data.mini_bid = 0;
        }

        var next_auction_id = module.exports.next_upcoming_auction(data.type);

        if (!next_auction_id){
            res.send("No Upcoming Auction");
        }
        else{
            // update auction_parameter
            updatequery = "UPDATE all_equipment SET auction_para = ?, auction = ?, mini_bid = ?, next_bid = ? where id = ?";
            connection.query(updatequery, [data.type, next_auction_id, data.mini_bid, data.mini_bid, data.id], function(err, rows){
                if (err){
                    throw err;
                }
                else {
                    connection.query("UPDATE auction_object SET auction = ?")
                    res.send("Auction status changes");
                }
            });
        }
    },

    // send all bids of a buyer.
    my_bids : function(req, res){
        selectquery = "SELECT * FROM bids WHERE buyer_id = ?"
        connection.query(selectquery, [req.session.id], function(rows, err){
            req.send(rows);
        });
    },

    //================================================================================
    //======================= General FUNCTIONS ======================================
    //================================================================================

    // THE MOST EXTENSIVE API.
    // when someone adds a bid.
    add_new_bid: function(req, res){
        data = req.body;
        var id = req.session.user;
        var category = req.session.category;
        var next_bid=0;
        // select that equipment with all its data
        selectquery = "SELECT * from all_equipment INNER JOIN auction ON all_equipment.auction = auction.id WHERE all_equipment.id = ?"
        connection.query(selectquery,[data.equip_id], function(err,rows){
            if(err){
                throw err;
            }
            else if(!rows.length){
                res.send("Not Available for auction");
                return;
            }
            // condition check for eligibility of client for auction.
            // this will change according to new policies.
            else if( (rows[0].auction_para == 0) || (rows[0].auction_para == 4) || ((rows[0].auction_para == 1 || rows[0].auction_para == 3)  && category !== 2) || (rows[0].auction_para == 2 && category !== 1)){

                res.send("You are not eligible for this auction");
                return;
            }
            else{
                // next_bid is the next minimum bid a client can have.
                next_bid=rows[0].next_bid;
            }

            // if bid submitted is less than next bid, discard it.
            if(data.new_bid <= next_bid){
                //message to send that you must bid higher than mini bid
                res.send({msg: "Please Bid higher"});
            }
            else {
                // update bid data if bid is acceptable
                next_bid = Number(data.new_bid) + 1000; // next bid is 1000 rs higher.
                data.equip_id = Number(data.equip_id);  // change to number as json gives always string.
                // insert new bid into table: bids
                insertQuery = "INSERT INTO bids (equip_id, auction_id, buyer_id, bid_price) values (?,?,?,?)";
                connection.query(insertQuery, [data.equip_id, rows[0].auction, id, data.new_bid], function(err, req, fields){
                    if(err) throw err;
                    else{
                        // update next bid in all_equipment.
                        updatequery = "UPDATE all_equipment SET next_bid = ? where id = ?";
                        connection.query(updatequery, [next_bid, data.equip_id], function(err,req){
                            if(err) throw err;
                            else{
                            res.send({msg: "Your bid is recorded"});
                            }
                        });
                    }
                });
            }
        });
    },


    // add a  car to likes if a dealer/user likes it.
    add_to_likes: (req,res)=>{
        insertQuery="INSERT IGNORE INTO likes (user_id, equip_id) VALUES (?,?)";// insert likes in that table.
        connection.query(insertQuery,[req.session.user, req.body.equip_id],(err,rows)=>{
            if(err){
                throw err;
            }
            else{
                if(rows.affectedRows){
                    //update number of likes of that equipment in all_equipment table.
                Query="UPDATE all_equipment SET likes=likes+1 WHERE id= ?"
        connection.query(Query,[req.body.equip_id],(err,rows)=>{
            if(err){
                throw err;
            }
            else{
                res.end();
            }
        });
            }
            res.end();
        }
        });
        
    },

    // all liked car/equipents by a dealer/user.
    my_likes: (req,res)=>{
        // select all items in all_equipments as table a, select all items in likes where user_id = now_id as table b
        // and then join with a.id = b.equip_id
        selectQuery="SELECT * FROM all_equipment a, (select * from likes WHERE user_id = ?) b where a.id = b.equip_id";
        connection.query(selectQuery,[req.session.user],(err,rows)=>{
             if(err){
                throw err;
                   }
             else{
                 res.send(rows);
                   } 
        });
    },

    // search suggestion as the user types.
    search_suggestions : function(req,res){
        ab =req.body.key+"%";
        connection.query("SELECT * from std_equipment where model like ?",[ab],function(err, rows,) {
            if (err) 
                throw err;
            else{
                var data=[];
                for(i=0;i<rows.length;i++)
                {       
                   data.push(rows[i].model);
                }
                res.end(JSON.stringify(data));
            }
        });
    },

    //Search API, finally search reasults.
    search : (req,res)=>{
        selectquery="SELECT * FROM all_equipment WHERE name = ? ORDER BY likes DESC";
        connection.query(selectquery,[req.body.name],(err,rows)=>{
            if(err)
                throw err;
            else{
                res.send(rows);
            }
        });
    },


//=================================================================================================
    // all upcoming auctions.
    next_auction : (req,res)=>{
        // select all auctions with time > NOW() and sort in ascending order
        selectquery = "SELECT * from auction WHERE end_time > NOW() ORDER BY start_time ASC";
        connection.query(selectquery, (err,rows)=>{
            if(err) throw err;
            else if(!rows.length){
                res.send("NO AUCTION AVAILABLE");
            }
        else {
            res.send(rows);
        // callback(rows);
            }
        });
    },

    // API for next auction.
    next_upcoming_auction: function(type){
        // select all auctions with time > NOW() and sort in ascending order
        selectquery = "SELECT id from auction WHERE ( start_time > NOW() AND type = ?) ORDER BY start_time ASC";
        connection.query(selectquery,[type], function(err,rows){
            if(err) throw err;
            else if(!rows.length){
                return undefined;
            }
            else {
                var auctionid = rows[0].id;
                return auctionid;
            }
        });
    },

    // select all the pending requests of cars..i.e wthose who are pending for transfer from one request to another.
    pending_request: function(req, res){
        // now auction para == 4 means car is pending.
        selectquery = "SELECT * from all_equipment where auction_para = '4' and dealer = ?";
        connection.query(selectquery, [req.session.user],function(err,rows){
            if (err) throw err;
            else res.send(rows);
        });

    }
}