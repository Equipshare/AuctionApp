
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

const notifier = require('node-notifier');

var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');

// =================================================

var ssn;//variable of session
var schedule = require('node-schedule');

var express  = require('express');
var app = express();
var crypto = require('crypto');



module.exports = {

	generate_mail: function (req, rows) {
        // body...
        crypto.randomBytes(20, function(err, buf){
            if(err)throw err;
            var token = buf.toString('hex');

            updatequery = "UPDATE account SET resetPasswordToken = ?, resetPasswordExpire = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE mobile = ?";

            connection.query(updatequery, [token, rows[0].mobile], function(err, rows){
                console.log(rows);
                if(err) throw err;
                else return rows;
                });


            var smtpTransport = nodemailer.createTransport({
                service:'SendGrid',
                port: 587,
                auth:{
                    user:'jarvis123',
                    pass:'abhansh@123'
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
    },

}