/*var mysql = require('mysql');
var dbconfig = require('./config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

const notifier = require('node-notifier');

var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');

connection.query("SELECT * FROM account", function(err,res){
  if(err){
    throw err;
  }
  else{
    console.log(res);
  }
});


var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "abc",
  password: "Abcd@1234",
  database: "eqsAuction"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
var sql = "CREATE TABLE account (id int NOT NULL AUTO_INCREMENT, username varchar(255) NOT NULL, password varchar(255), category int(4), email varchar(64), mobile int(12), wallet int(28), address varchar(255),  PRIMARY KEY (id));"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

  CREATE TABLE account (id int NOT NULL AUTO_INCREMENT, username varchar(255) NOT NULL, password varchar(255), category int(4), email varchar(64), mobile int(12), wallet int(28), address varchar(255), resetPasswordToken varchar(50), resetPasswordExpire TIMESTAMP,  PRIMARY KEY (id));

  CREATE TABLE location (sno int NOT NULL AUTO_INCREMENT, city varchar(255) NOT NULL, state varchar(255) NOT NULL, dealerdealer_count int(16), equipment_count int(64), PRIMARY KEY (sno));

  CREATE TABLE admin (id int(5), location int(5), boss_id int(5));
  
  CREATE TABLE dealer (id int(5), location varchar(30), pan_number varchar(25), GST_number varchar(25), deal_count int(6), total_asset int(7), req_stat int(1));

  CREATE TABLE std_equipment (id int NOT NULL AUTO_INCREMENT, asset_name varchar(25), model varchar(25), market_price int(12), description varchar (1500),search_count int, view_count int, auction_count int,  PRIMARY KEY (id));

  CREATE TABLE all_equipment (id int NOT NULL AUTO_INCREMENT, name varchar(50), bought_price int(12), year int(4), rating int(1), dealer BOOL, auction_para tinyint, auction int, mini_bid int, next_bid int,  PRIMARY KEY (id));

  CREATE TABLE auction (id int NOT NULL AUTO_INCREMENT, start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, is_featured int(1), PRIMARY KEY (id));

  CREATE TABLE bids (id int NOT NULL AUTO_INCREMENT, equip_id int, auction_id int, buyer_id int, bid_price int, PRIMARY KEY (id));

  CREATE TABLE purchase_details (purchase_id  INT AUTO_INCREMENT PRIMARY KEY, user_id int(5), costumer_name varchar(25), contact varchar(12), address varchar(255));

  CREATE TABLE purchase_pref (purchase_id int(5), pref_1 varchar(40), pref_2 varchar(40), pref_3 varchar(40), pref_4 varchar(40), m_range varchar(10));

  CREATE TABLE enquiry ( sender_id int, reciever_id int, description varchar(200) );

              //      //     CREATE TABLE chatdata (sender_id INT, reciever_id INT, time TIMESTAMP, msg_int int);

  Create table deals (id int not null AUTO_INCREMENT, seller_id int, buyer_id int,bid_price int,equip_id int, auction_id int, sale_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, mysql> Create table deals (id int not null AUTO_INCREMENT, seller_id int, buyer_id int,bid_price int,equip_id int, auction DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id));
  
*/





/*


"SELECT GROUP_CONCAT(lv SEPARATOR ',') FROM ( SELECT @pv:=(SELECT GROUP_CONCAT(id SEPARATOR ',') FROM admin WHERE boss_id IN (@pv)) AS lv FROM admin JOIN (SELECT @pv:=12)tmp WHERE boss_id IN (@pv)) a;"


"select  * from    (select * from admin order by boss_id, id) products_sorted, (select @pv := '12') initialisation where   find_in_set(boss_id, @pv) > 0 and     @pv := concat(@pv, ',', id)"


*/
