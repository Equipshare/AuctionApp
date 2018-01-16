
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


	loginfunc: function(req, res) {
        res.send("WELCOME PLEASE LOGIN");
    },


    // sends user data according to category
    profilefunc: function(req, res) {
        var userid = req.session.user;
        var category = req.session.category;
        var data_id = req.params.id;
        var profile = {};
        console.log(req.body.hides);
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

    // route middleware to make sure
	isLoggedInfunc: function isLoggedIn(req, res, next) {
         console.log(req.session);
        //return next();
	    // if user is authenticated in the session, carry on
	    if (req.isAuthenticated()){
	        return next();
        }
	    // if they aren't redirect them to the home page
	    res.redirect('/login');
	},


    // Ends current sessiom
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
                wallet_balance : rows[0].wallet, // send balance info.
                user: userid,
                category : category
            };
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

    dashboard: function(req, res){
        var userid = req.session.user;
        var category = req.session.category;
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


    show_car: (req,res)=>{
        var car_id=req.params.id;
        var user_id=req.session.user;
        var car={};
        connection.query("SELECT * FROM all_equipment WHERE id = ?",[car_id],(err,rows)=>{
            if(err)
                throw err;
            else{
                if(rows.length!==0)
                {
                    if(rows[0].dealer==user_id)
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
                    res.send("CAR NOT FOUND");    
                }
            });
        },

    forgot: function(req, res){
        var userid = req.body.mobile;
        selectquery = "SELECT * from account where mobile = ?";
        connection.query(selectquery, [userid], function(err, rows){
            console.log(rows);

            if(err)throw err;
            else if(!rows.length){
                res.send("no user with this mobile exists");
            }
            else {
                others.generate_mail(req, rows);
                res.send("A mail has been send to your registered email-id")
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
            res.send(result);
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

            console.log(req.body);
            password = bcrypt.hashSync(req.body.password, null, null);
            resetPasswordExpire = undefined;
            resetPasswordToken = undefined;
            updatequery = "UPDATE account set password = ?, resetPasswordToken = ?, resetPasswordExpire = ? WHERE mobile = ?";
            connection.query(updatequery, [password, resetPasswordToken, resetPasswordExpire, rows[0].mobile], function(err, rows){
                if(err)throw err;
                console.log(password);
                res.status(200).json({data: rows, message : " Your password has been reset."});
            });
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
                req.send("Please add a location to view");
            }
            else {
                if(category== 3 || category == 2){
                    res.send(rows); 
                }
                else res.send("Not found");
            }
        });
    },

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
                res.send(rows);
            }
        });
    },

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

    my_bids : function(req, res){
        selectquery = "SELECT * FROM bids WHERE buyer_id = ?"
        connection.query(selectquery, [req.session.id], function(rows, err){
            req.send(rows);
        });
    },

    //================================================================================
    //======================= General FUNCTIONS ======================================
    //================================================================================

    add_new_bid: function(req, res){
        data = req.body;
        var id = req.session.user;
        var category = req.session.category;
        var next_bid=0;
        selectquery = "SELECT * from all_equipment INNER JOIN auction ON all_equipment.auction = auction.id WHERE all_equipment.id = ?"
        connection.query(selectquery,[data.equip_id], function(err,rows){
            if(err){
                throw err;
            }
            else if(!rows.length){
                res.send("Not Available for auction");
                return;
            }
            else if( (rows[0].auction_para == 0) || (rows[0].auction_para == 4) || ((rows[0].auction_para == 1 || rows[0].auction_para == 3)  && category !== 2) || (rows[0].auction_para == 2 && category !== 1)){

                res.send("You are not eligible for this auction");
                return;
            }
            else{
                next_bid=rows[0].next_bid;
            }

        
            if(data.new_bid <= next_bid){
                //message to flash that you must bid higher than mini bid
                console.log('smaller than mini bid');
                res.send("Please Bid higher");
            }
            else {
                next_bid = Number(data.new_bid) + 1000;
                data.equip_id = Number(data.equip_id);        
                insertQuery = "INSERT INTO bids (equip_id, auction_id, buyer_id, bid_price) values (?,?,?,?)";
                connection.query(insertQuery, [data.equip_id, rows[0].auction, id, data.new_bid], function(err, req, fields){
                    if(err) throw err;
                    else{
                        updatequery = "UPDATE all_equipment SET next_bid = ? where id = ?";
                        connection.query(updatequery, [next_bid, data.equip_id], function(err,req){
                            if(err) throw err;
                            else{
                            res.send("Your bid is recorded");
                            }
                        });
                    }
                });
            }
        });
    },

        add_to_likes: (req,res)=>{
            console.log(req.session);
            console.log(req.data);
        insertQuery="INSERT IGNORE INTO likes (user_id, equip_id) VALUES (?,?)";
        connection.query(insertQuery,[req.session.user, req.body.equip_id],(err,rows)=>{
            if(err){
                throw err;
            }
            else{
                console.log(rows);
                if(rows.affectedRows){
                    console.log('dfdfgh');
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


    my_likes: (req,res)=>{
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
    
    next_auction : (req,res)=>{
        selectquery = "SELECT * from auction WHERE end_time > NOW() ORDER BY start_time ASC";
        connection.query(selectquery, (err,rows)=>{
            if(err) throw err;
            else if(!rows.length){
                res.send("NO AUCTION AVAILABLE");
            }
        else {
            console.log(rows);
            res.send(rows);
        // callback(rows);
            }
        });
    },


    next_upcoming_auction: function(type){
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


    pending_request: function(req, res){
        selectquery = "SELECT * from all_equipment where auction_para = '4' and dealer = ?";
        connection.query(selectquery, [req.session.user],function(err,rows){
            if (err) throw err;
            else res.send(rows);
        });

    }
}