
// functions for dealers


var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

const notifier = require('node-notifier');

var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');

// //=================================================

var schedule = require('node-schedule');

var express  = require('express');
var app = express();
var crypto = require('crypto');

// var general = require('./general_function/general');

module.exports = {

	//================================================================================
    //======================= Dealer FUNCTIONS =======================================
    //================================================================================

    //inserts additional details into dealer's database
    complete_profile: function(req,res){
        connection.query("SELECT sno, city FROM location", function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.send(rows);
            }
        });
    },

    
    //inserts additional details into dealer's database
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

    // Code below this was written by Shivam. I will ask him for adding cooments.
    // Below code is mostly for autobidder.

    //ADDS details and preferences of costumer through dealer's account
    dealer_purchase: (req,res)=>{
        selectQuery = "";//to do
        // connection.query("SELECT id, asset_name, model FROM std_equipment", function(err, rows){
          //  if (err){
            //    throw err;
            //}
            //else {
                res.send({
                    user : '',
                    message : "" // get the user out of session and pass to template
                });
            //}
        //});
    },


    //ADDS details and preferences of costumer through dealer's account
    dealer_purchase_post_form: (req,res)=>{          
        var id=req.session.user;
        var data=req.body;
        var purchaseid;

        insertQuery = "INSERT INTO purchase_details (user_id, costumer_name, contact, address) VALUES (?,?,?,?) "; //
        connection.query(insertQuery,[id, data.name, data.contact, data.address], function(err, rows){
            if (err){
                throw err;
            }else{
                //TO DO
                 console.log("index  "+rows.insertId);
                 purchaseid=rows.insertId;
                    var prefQuery = "INSERT INTO purchase_pref (purchase_id, range_high, range_low, km_high, km_low, type1 ,type2, type3, type4, year_high, year_low) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        
                connection.query(prefQuery,[purchaseid, data.range_high, data.range_low, data.km_high, data.km_low, data.type1, data.type2, data.type3, data.type4, data.year_high, data.year_low], function(err, rows){
                    if (err){
                        throw err;
                    }
                    else{
                        res.redirect("/profile");
                    }
                });
            }
        });
            
    },

    // Adds information of car/equipment that a costumer has come to sell personally
    dealer_sell : (req, res)=>{
        connection.query("SELECT brand, model, varient FROM std_equipment", function(err, rows){
            if (err){
                throw err;
            }
            else {
                res.send(rows);
            }
        });
    },

    // Adds information of car/equipment that a costumer has come to sell personally
    dealer_sell_post_form:  function(req,res){
        var id = req.session.user;
        var data = req.body;
        console.log(data);
        insertQuery = "INSERT INTO sell_lead (dealer,name,contact,email,brand,model,varient,bought_price,year,colour,km,owner_no,city,locality,expectation) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        connection.query(insertQuery,[id,data.name,data.contact,data.email, data.brand, data.model, data.varient, data.bought_price, data.year, data.colour, data.km, data.owner, data.city, data.locality, data.expectation], function(err, rows){
            if (err){
                throw err;
            }
            else {
                console.log(rows);
                res.redirect('/profile');
            }
        });
    },

    // Adds task schedule for a dealer for personal use
    schedule: (req,res)=>{

        var id = req.session.user;
        var time = req.body.time;
        var details = req.body.detail;
        var subject = req.body.subject;

        insertQuery = "INSERT INTO schedule (id,time,subject,details) VALUES (?,?,?)";
        connection.query(insertQuery,[id,time,subject,details],(err,rows)=>{
            if(err){
                throw err;
            }
            else{
                res.end();
            }
        });
    },

    // Displays all schedule of dealer
    my_schedule: (req,res)=>{

        id =req.session.user;
        connection.query("SELECT * FROM schedule WHERE id = ? ORDER BY time DESC",[id],(err,rows)=>{
            if(err)
                throw err;
            else
            {
                res.send(rows);
            }
        });
    },

    car_match: (req,res)=>{

        connection.query("SELECT * FROM purchase_pref WHERE purchase_id = ?",[],(err,rows)=>{
            if(err)
                throw err;
            else
            {
                if(rows.length)
                {   
                    selectQuery="SELECT *,if( ? > expectation AND ? < expectation ,20,0) + if(? > km AND ? < km,15,0) + if(strcmp(?,type)=0 ,20,0) + if(strcmp(?,type)=0 ,16,0) + if(strcmp(?,type)=0 ,10,0) + if(strcmp(?,type)=0 ,7,0) + if( ? > year AND ? < year,10,0) as rating FROM all_equipment ORDER BY rating DESC";
                    connection.query(selectQuery,[rows[0].range_high, rows[0].range_low, rows[0].km_high, rows[0].km_low, rows[0].type1, rows[0].type2, rows[0].type3, rows[0].type4, rows[0].year_high, rows[0].year_low], (err,result)=>{
                        if(err)
                            throw err;
                        else
                        {
                            res.send(result);
                        }
                    });
                }
            }
        });

    },

    // Displays all sell requests made to dealer
    sell_lead: (req,res)=>{

            connection.query("SELECT * FROM sell_lead",(err,rows)=>{
                if(err) 
                     throw err;
                else
                {
                    res.send(rows);
                }
            });
        },
}

