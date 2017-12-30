-- MySQL dump 10.13  Distrib 5.7.20, for Linux (x86_64)
--
-- Host: localhost    Database: eqsAuction
-- ------------------------------------------------------
-- Server version	5.7.20-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(255) DEFAULT NULL,
  `category` int(4) DEFAULT NULL,
  `email` varchar(64) DEFAULT NULL,
  `wallet` int(28) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `resetPasswordToken` varchar(50) DEFAULT NULL,
  `resetPasswordExpire` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `mobile` varchar(13) NOT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `middle_name` varchar(30) DEFAULT NULL,
  `altmobile` varchar(12) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `zipcode` varchar(12) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'$2a$10$ECOREaMhZcM2AVYyymDUreAG9YwQU45iGAFsQzrK9CeOqnoDCiXiq',1,NULL,NULL,NULL,NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'1',2,'a@b.com',0,'sasA',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'$2a$10$bnkkdRrF9OplEbqEidf/gOEqp2yrHsRiXkubjbW6DS1DhIBbJosBm',1,'a@b',0,'dfghj',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'$2a$10$exDpD.pFuJbKhLl4l.hwYufnZPNxddOnwoGmP1bkvRJDchA6fxoJm',1,'b@q.com',0,'ertyui',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'$2a$10$GNs/t240G2lZ2xDna1CqB.W3I1KKibWDnemUss47/bTrPaURFAFi.',1,'a@b',0,'ghhjhj',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'$2a$10$klVKyWtdfHBiOQviFTkT2eGO1lHfH2KxRCCg3zXIq48tezltMzQ3a',1,'q@q.com',0,'asdfghjkl',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'$2a$10$3ZgooIWHtqNExBya6VzWx.SAYy3.v3ViWHFgAvTKNZK5EmFsRE8m.',1,'a@b.com',0,'455',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'$2a$10$v/SRgqBz0n8iIUMgI.MIGeZOkrCL.xslSxl3VwQbAs0vZevk0Q0dy',1,'a@gd',0,'fghjk',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'$2a$10$7Azg9Q1UVWjnZppIO9uqA.nW3ZSBpv3wII3m7F9UqS53iup4trq.m',1,'mn@m',0,'mn',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'$2a$10$HVNZ10hh4YlqlvPU4gfYb.oCP7TybDiDALhYtcDKlT2arg4DJdboa',1,'a@v.com',0,'ghghgh',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'$2a$10$CIeL9VLvaAnSvDaCUY5byuk/mu.gMSinU3oVlgQR5KivfiRlPCuxG',2,'dea@d.com',0,'ghjkl','6e942a778010916619724ddf96aeff4b41081700','2017-12-22 11:38:49','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'$2a$10$qYmOjqad9DwqeMpddHt0B.8RlNTQcl7Y/RzcImFG3ObApqnMq1DGq',3,'p@q.com',0,'dfghj','670af4f5a760aff3a5fca6417d43ae675afbe10d','2017-12-30 07:47:40','1234567890',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'yo',3,'yo@yo.com',0,'yo',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'xy',3,'xy@xy.com',0,'yuyug',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,NULL,3,'ty@ty.com',0,'ty',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'$2a$10$WStikzpjYuCjajRmHgMD3ep6uoSIWSGGUQxQmVfsqIstjIqhqas3e',2,'qw@qw.com',0,'qwqw',NULL,'2017-12-22 05:28:06','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,'qq',3,'qq@qq.com',0,'qwq',NULL,'2017-12-26 05:14:04','9876543219',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,'fghjk',3,'fghj@sdfgh.com',0,'wertyui','b8cfc913b81448e35cffc4a951f214cb631b12f2','2017-12-22 11:30:56','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,'dfghj',3,'ertyui@eq.com',0,'sdfghj',NULL,'2017-12-22 10:46:49','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,'wertyui',3,'ertyui@fgh.com',0,'sdfghj',NULL,'2017-12-22 10:48:00','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,'dfghjk',3,'dfg@dfgh.com',0,'dfgh',NULL,'2017-12-22 10:49:53','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,'xccvvc',3,'xc@x.com',0,'cggvg',NULL,'2017-12-22 10:51:28','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,'$2a$10$8ezUAGxsP3.rKnUXWJnUBOCxbNmUFh6dK5/KRh1r2YGphgM5oqnaO',3,'zxf@xfg.com',0,'dfghj','670af4f5a760aff3a5fca6417d43ae675afbe10d','2017-12-30 07:47:40','1234567890',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,'$2a$10$PGWQHAT32LMHRv.divFbR.bAoibLxTxhzxEniI0/yvxnPGJ1xUOAG',3,'dfgh@a.com',0,'dfghj',NULL,'2017-12-22 10:59:51','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,'$2a$10$I09707EruFMWApJ8hzQmAeI4m43dJJg5xCWefzW/15AHJA.jflYKa',3,'ghj@sdfg.com',0,'fghj',NULL,'2017-12-22 12:04:36','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,'$2a$10$nZXjfVkasPj8.QVrjo2qYu5rgydz8PSAGy0iZKZHOwqKU/hH5PrbG',1,'wert@wer.com',0,'rtyghjk',NULL,'2017-12-22 17:15:14','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,'$2a$10$fdz7s557E0uFB8NNenZ6cees5SQorZB26obaPzwSqLjKzflqX16L6',2,'fghjk@asa.com',0,'gyuhbj',NULL,'2017-12-22 17:16:26','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,'$2a$10$uNxjP9jzeNgNlN0yjbKpQ.R.5TIHrk3S0o818KjhG1/txT5uSAfES',2,'me@myself.com',0,'qaesdrfcggb',NULL,'2017-12-28 11:18:48','6196196196',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,'$2a$10$g8DW5l4ANLcbWi1ihEQSxeNmDwspjDtxnNC53ztxneXjsOOMliiOm',3,'doa@do.com',0,'\"$$$$&*\"+\"\\n\\p*\"',NULL,'2017-12-28 11:50:19','\\n\\\\n\\n\'n\\',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` int(5) DEFAULT NULL,
  `location` int(5) DEFAULT NULL,
  `boss_id` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (14,1,12),(15,1,12),(17,1,12),(18,1,12),(19,1,12),(20,1,12),(21,1,12),(22,1,12),(23,1,12),(24,1,23);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `all_equipment`
--

DROP TABLE IF EXISTS `all_equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `all_equipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand` varchar(20) DEFAULT NULL,
  `model` varchar(20) DEFAULT NULL,
  `varient` varchar(15) DEFAULT NULL,
  `bought_price` int(12) DEFAULT NULL,
  `year` int(4) DEFAULT NULL,
  `dealer` int(11) DEFAULT NULL,
  `auction_para` int(1) DEFAULT NULL,
  `auction` int(11) DEFAULT NULL,
  `mini_bid` int(11) DEFAULT NULL,
  `next_bid` int(11) DEFAULT NULL,
  `likes` int(3) DEFAULT '0',
  `colour` varchar(15) DEFAULT NULL,
  `km` int(11) DEFAULT NULL,
  `owner_no` int(1) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `locality` varchar(40) DEFAULT NULL,
  `expectation` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `all_equipment`
--

LOCK TABLES `all_equipment` WRITE;
/*!40000 ALTER TABLE `all_equipment` DISABLE KEYS */;
INSERT INTO `all_equipment` VALUES (1,NULL,NULL,NULL,56565,2010,16,1,1,1000,11100,1,NULL,NULL,NULL,NULL,NULL,NULL),(2,NULL,NULL,NULL,8787,2010,16,0,NULL,NULL,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(3,NULL,NULL,NULL,545,2010,16,1,NULL,NULL,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(4,NULL,NULL,NULL,45454,2010,16,0,1,0,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(5,NULL,NULL,NULL,7452,2010,16,0,1,0,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(6,NULL,NULL,NULL,54545,2010,16,1,1,10000,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(7,NULL,NULL,NULL,45454,2010,16,1,NULL,NULL,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(8,NULL,NULL,NULL,456123486,2010,16,0,NULL,NULL,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(9,NULL,NULL,NULL,988878,2010,16,0,NULL,NULL,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(10,NULL,NULL,NULL,988878,2010,16,0,NULL,NULL,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(11,NULL,NULL,NULL,445445,2010,16,1,1,0,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(12,NULL,NULL,NULL,45454,2010,16,1,1,10000,10000,0,NULL,NULL,NULL,NULL,NULL,NULL),(13,NULL,NULL,NULL,100000,2010,11,2,2,NULL,10000,0,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `all_equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auction`
--

DROP TABLE IF EXISTS `auction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auction`
--

LOCK TABLES `auction` WRITE;
/*!40000 ALTER TABLE `auction` DISABLE KEYS */;
INSERT INTO `auction` VALUES (1,'2017-01-20 04:30:00','2017-03-23 20:31:00',2),(2,'2017-04-20 04:30:00','2017-05-23 20:31:00',2),(3,'2017-06-20 04:30:00','2017-07-23 20:31:00',2),(4,'2017-11-27 09:30:00','2017-11-27 14:30:00',1);
/*!40000 ALTER TABLE `auction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auction_object`
--

DROP TABLE IF EXISTS `auction_object`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auction_object` (
  `auction_id` int(11) NOT NULL,
  `equip_id` int(11) NOT NULL,
  `mini_bid` int(11) DEFAULT NULL,
  `maxi_bid` int(11) DEFAULT NULL,
  `buyer_id` int(7) DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auction_object`
--

LOCK TABLES `auction_object` WRITE;
/*!40000 ALTER TABLE `auction_object` DISABLE KEYS */;
INSERT INTO `auction_object` VALUES (2,4,0,5000,12,19,'2017-12-29 07:18:59'),(2,6,10000,15000,12,28,'2017-12-29 07:18:59'),(2,7,NULL,5000,12,21,'2017-12-29 07:18:59');
/*!40000 ALTER TABLE `auction_object` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bids`
--

DROP TABLE IF EXISTS `bids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equip_id` int(11) DEFAULT NULL,
  `auction_id` int(11) DEFAULT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `bid_price` int(11) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bids`
--

LOCK TABLES `bids` WRITE;
/*!40000 ALTER TABLE `bids` DISABLE KEYS */;
INSERT INTO `bids` VALUES (1,1,1,11,NULL,'2017-12-29 07:18:59'),(2,1,1,11,8000,'2017-12-29 07:18:59'),(3,1,1,11,60000,'2017-12-29 07:18:59'),(4,1,1,11,10000,'2017-12-29 07:18:59'),(5,1,1,11,5000,'2017-12-29 07:18:59'),(6,1,1,11,5000,'2017-12-29 07:18:59'),(7,1,1,11,6000,'2017-12-29 07:18:59'),(8,1,1,11,8000,'2017-12-29 07:18:59'),(9,1,1,11,10000,'2017-12-29 07:18:59'),(10,1,1,11,15000,'2017-12-29 07:18:59'),(11,1,1,11,17000,'2017-12-29 07:18:59'),(12,1,1,11,12,'2017-12-29 07:18:59'),(13,1,1,11,12,'2017-12-29 07:18:59'),(14,1,1,11,1600,'2017-12-29 07:18:59'),(15,4,2,12,1000,'2017-12-29 07:18:59'),(16,4,2,12,2000,'2017-12-29 07:18:59'),(17,4,2,12,3000,'2017-12-29 07:18:59'),(18,4,2,12,4000,'2017-12-29 07:18:59'),(19,4,2,12,5000,'2017-12-29 07:18:59'),(20,6,2,12,5000,'2017-12-29 07:18:59'),(21,7,2,12,5000,'2017-12-29 07:18:59'),(22,6,2,12,6000,'2017-12-29 07:18:59'),(23,6,2,12,7000,'2017-12-29 07:18:59'),(24,6,2,12,9000,'2017-12-29 07:18:59'),(25,6,2,12,10000,'2017-12-29 07:18:59'),(26,6,2,12,11000,'2017-12-29 07:18:59'),(27,6,2,12,12000,'2017-12-29 07:18:59'),(28,6,2,12,15000,'2017-12-29 07:18:59'),(29,1,NULL,28,100000,'2017-12-29 07:18:59'),(30,1,1,28,101000,'2017-12-29 07:18:59'),(31,1,1,28,101000,'2017-12-29 07:18:59'),(32,1,1,28,101000,'2017-12-29 07:18:59'),(33,1,1,28,101000,'2017-12-29 07:18:59'),(34,1,1,28,10100,'2017-12-29 07:18:59');
/*!40000 ALTER TABLE `bids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealer`
--

DROP TABLE IF EXISTS `dealer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dealer` (
  `id` int(5) DEFAULT NULL,
  `location` int(5) DEFAULT NULL,
  `pan_number` varchar(25) DEFAULT NULL,
  `gst_number` varchar(25) DEFAULT NULL,
  `deal_count` int(6) DEFAULT NULL,
  `total_asset` int(7) DEFAULT NULL,
  `req_stat` int(1) DEFAULT NULL,
  `is_authenthcated` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealer`
--

LOCK TABLES `dealer` WRITE;
/*!40000 ALTER TABLE `dealer` DISABLE KEYS */;
/*!40000 ALTER TABLE `dealer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deals`
--

DROP TABLE IF EXISTS `deals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `seller_id` int(11) DEFAULT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `bid_price` int(11) DEFAULT NULL,
  `equip_id` int(11) DEFAULT NULL,
  `auction_id` int(11) DEFAULT NULL,
  `sale_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deals`
--

LOCK TABLES `deals` WRITE;
/*!40000 ALTER TABLE `deals` DISABLE KEYS */;
/*!40000 ALTER TABLE `deals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiry`
--

DROP TABLE IF EXISTS `enquiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enquiry` (
  `sender_id` int(11) DEFAULT NULL,
  `reciever_id` int(11) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `subject` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiry`
--

LOCK TABLES `enquiry` WRITE;
/*!40000 ALTER TABLE `enquiry` DISABLE KEYS */;
INSERT INTO `enquiry` VALUES (24,23,'KHATRU!!!','ABCD');
/*!40000 ALTER TABLE `enquiry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `likes` (
  `user_id` int(11) NOT NULL,
  `equip_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`equip_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (28,1);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `sno` int(11) NOT NULL AUTO_INCREMENT,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `dealer_count` int(16) DEFAULT NULL,
  `equipment_count` int(64) DEFAULT NULL,
  PRIMARY KEY (`sno`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'INDORE','MP',0,0),(2,'MUMBAI','Maharastra',0,0);
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_details`
--

DROP TABLE IF EXISTS `purchase_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase_details` (
  `purchase_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(5) DEFAULT NULL,
  `costumer_name` varchar(25) DEFAULT NULL,
  `contact` varchar(12) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`purchase_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_details`
--

LOCK TABLES `purchase_details` WRITE;
/*!40000 ALTER TABLE `purchase_details` DISABLE KEYS */;
INSERT INTO `purchase_details` VALUES (2,5,NULL,NULL,NULL),(3,2,'blue','23456789','sdfghj');
/*!40000 ALTER TABLE `purchase_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_pref`
--

DROP TABLE IF EXISTS `purchase_pref`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase_pref` (
  `purchase_id` int(11) DEFAULT NULL,
  `range_high` int(11) DEFAULT NULL,
  `range_low` int(11) DEFAULT NULL,
  `km_high` int(11) DEFAULT NULL,
  `km_low` int(11) DEFAULT NULL,
  `type1` varchar(20) DEFAULT NULL,
  `type2` varchar(20) DEFAULT NULL,
  `type3` varchar(20) DEFAULT NULL,
  `type4` varchar(20) DEFAULT NULL,
  `year_high` int(4) DEFAULT NULL,
  `year_low` int(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_pref`
--

LOCK TABLES `purchase_pref` WRITE;
/*!40000 ALTER TABLE `purchase_pref` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_pref` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedule` (
  `id` int(6) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subject` varchar(50) DEFAULT NULL,
  `details` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sell_lead`
--

DROP TABLE IF EXISTS `sell_lead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sell_lead` (
  `dealer` int(6) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `contact` varchar(12) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `brand` varchar(20) DEFAULT NULL,
  `model` varchar(20) DEFAULT NULL,
  `varient` varchar(20) DEFAULT NULL,
  `bought_price` int(11) DEFAULT NULL,
  `year` int(4) DEFAULT NULL,
  `colour` varchar(10) DEFAULT NULL,
  `km` int(10) DEFAULT NULL,
  `owner_no` int(1) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `locality` varchar(40) DEFAULT NULL,
  `expectation` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sell_lead`
--

LOCK TABLES `sell_lead` WRITE;
/*!40000 ALTER TABLE `sell_lead` DISABLE KEYS */;
/*!40000 ALTER TABLE `sell_lead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `std_equipment`
--

DROP TABLE IF EXISTS `std_equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `std_equipment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand` varchar(25) DEFAULT NULL,
  `model` varchar(25) DEFAULT NULL,
  `varient` varchar(25) DEFAULT NULL,
  `details` varchar(2000) DEFAULT NULL,
  `description` varchar(1500) DEFAULT NULL,
  `search_count` int(11) DEFAULT NULL,
  `view_count` int(11) DEFAULT NULL,
  `auction_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `std_equipment`
--

LOCK TABLES `std_equipment` WRITE;
/*!40000 ALTER TABLE `std_equipment` DISABLE KEYS */;
INSERT INTO `std_equipment` VALUES (1,'Honda','city','LTS','{\"details\":\"are bhai bhai bhai\",\"its me\":\"jsajdksajk\",\"dahsj\":\"hjhdhsj\",\"ertyu\":\"rtyu\"}','YE HE KHATARNAAK CAAR!!!!!!!',0,0,0);
/*!40000 ALTER TABLE `std_equipment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-30 18:19:06
