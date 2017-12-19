/*

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

  CREATE TABLE account (id int NOT NULL AUTO_INCREMENT, username varchar(255) NOT NULL, password varchar(255), category int(4), email varchar(64), mobile int(12), wallet int(28), address varchar(255),  PRIMARY KEY (id));

  CREATE TABLE location (sno int NOT NULL AUTO_INCREMENT, city varchar(255) NOT NULL, state varchar(255) NOT NULL, dealer_count int(16), equipment_count int(64), PRIMARY KEY (sno));

  CREATE TABLE admin (id int(5), location int(5), boss_id int(5);
  
  CREATE TABLE dealer (id int(5), location int(5), pan_number varchar(25), GST_number varchar(25), deal_count int(6), total_asset int(7), req_stat int(1));

  CREATE TABLE std_equipment (id int NOT NULL AUTO_INCREMENT, asset_name varchar(25), model varchar(25), market_price int(12), description varchar (1500),search_count int, view_count int, auction_count int,  PRIMARY KEY (id));

  CREATE TABLE all_equipment (id int NOT NULL AUTO_INCREMENT, name varchar(50), bought_price int(12), year int(4), rating int(1), dealer BOOL, auction_para int, auction int,  PRIMARY KEY (id));

  CREATE TABLE auction (id int NOT NULL AUTO_INCREMENT, start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, is_featured int(1), PRIMARY KEY (id));


, 
*/