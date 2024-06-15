-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: baixe
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `camera`
--

DROP TABLE IF EXISTS `camera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `camera` (
  `id_camera` int(11) NOT NULL AUTO_INCREMENT,
  `id_cong` int(11) NOT NULL,
  `tencamera` varchar(20) NOT NULL,
  `trangthai` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_camera`),
  KEY `id_cong` (`id_cong`),
  CONSTRAINT `camera_ibfk_1` FOREIGN KEY (`id_cong`) REFERENCES `cong` (`id_cong`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camera`
--

LOCK TABLES `camera` WRITE;
/*!40000 ALTER TABLE `camera` DISABLE KEYS */;
INSERT INTO `camera` VALUES (1,1,'Camera vào A','Hoạt động',1),(2,2,'Camera ra A','Hoạt động',1);
/*!40000 ALTER TABLE `camera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cong`
--

DROP TABLE IF EXISTS `cong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cong` (
  `id_cong` int(11) NOT NULL AUTO_INCREMENT,
  `tencong` varchar(20) NOT NULL,
  PRIMARY KEY (`id_cong`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cong`
--

LOCK TABLES `cong` WRITE;
/*!40000 ALTER TABLE `cong` DISABLE KEYS */;
INSERT INTO `cong` VALUES (1,'Cổng vào A'),(2,'Cổng ra A');
/*!40000 ALTER TABLE `cong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khachhang`
--

DROP TABLE IF EXISTS `khachhang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `khachhang` (
  `id_khachhang` int(11) NOT NULL AUTO_INCREMENT,
  `hoten` varchar(50) NOT NULL,
  `socanho` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_khachhang`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khachhang`
--

LOCK TABLES `khachhang` WRITE;
/*!40000 ALTER TABLE `khachhang` DISABLE KEYS */;
INSERT INTO `khachhang` VALUES (1,'Trần Tuấn Phong','Skylake 04-01',1),(2,'Nguyễn Trịnh Tấn Phát','Lotus 08-05',1),(3,'Đinh Thị Mây','Sunshine 04-06',1),(4,'Lê Minh Hiếu','Ocean 12-04',1),(5,'Hoàng Thị Thùy Linh','Diamond 06-07',1),(6,'Hoàng Trọng Nghĩa','Horizon 09-02',1);
/*!40000 ALTER TABLE `khachhang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichsu`
--

DROP TABLE IF EXISTS `lichsu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lichsu` (
  `id_lichsu` int(11) NOT NULL AUTO_INCREMENT,
  `id_cong` int(11) NOT NULL,
  `sothe` varchar(20) NOT NULL,
  `bienso` varchar(20) NOT NULL,
  `id_khachhang` int(11) DEFAULT NULL,
  `id_nhanvien` int(11) NOT NULL,
  `thoigianmo` datetime NOT NULL DEFAULT current_timestamp(),
  `path_anhphuongtien` varchar(255) NOT NULL,
  `path_anhbienso` varchar(255) NOT NULL,
  PRIMARY KEY (`id_lichsu`),
  KEY `id_cong` (`id_cong`),
  KEY `id_nhanvien` (`id_nhanvien`),
  KEY `sothe` (`sothe`),
  KEY `id_khachhang` (`id_khachhang`),
  CONSTRAINT `lichsu_ibfk_1` FOREIGN KEY (`id_cong`) REFERENCES `cong` (`id_cong`),
  CONSTRAINT `lichsu_ibfk_2` FOREIGN KEY (`id_nhanvien`) REFERENCES `nhanvien` (`id_nhanvien`),
  CONSTRAINT `lichsu_ibfk_3` FOREIGN KEY (`sothe`) REFERENCES `the` (`sothe`),
  CONSTRAINT `lichsu_ibfk_4` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichsu`
--

LOCK TABLES `lichsu` WRITE;
/*!40000 ALTER TABLE `lichsu` DISABLE KEYS */;
INSERT INTO `lichsu` VALUES (65,1,'11 9C A9 23','15A16622',1,1,'2024-06-10 12:03:01','public\\images\\anhlichsu\\2024-10-06 12 03 01_full.jpg','public\\images\\anhlichsu\\2024-06-10 12 03 01_crop.jpg'),(66,1,'11 9C A9 23','15AT00229',1,1,'2024-06-10 12:16:56','public\\images\\anhlichsu\\2024-10-06 12 16 56_full.jpg','public\\images\\anhlichsu\\2024-06-10 12 16 56_crop.jpg'),(67,2,'11 9C A9 23','15AT00229',1,1,'2024-06-10 12:51:21','public\\images\\anhlichsu\\2024-10-06 12 51 21_full.jpg','public\\images\\anhlichsu\\2024-06-10 12 51 21_crop.jpg'),(68,1,'1A 0F 9C 17','15B411686',2,1,'2024-06-10 13:16:56','public\\images\\anhlichsu\\2024-10-06 13 16 56_full.jpg','public\\images\\anhlichsu\\2024-06-10 13 16 56_crop.jpg'),(69,2,'11 9C A9 23','15A16622',1,1,'2024-06-10 13:21:46','public\\images\\anhlichsu\\2024-10-06 13 21 46_full.jpg','public\\images\\anhlichsu\\2024-06-10 13 21 46_crop.jpg'),(70,1,'A1 E4 0E 1B','15A16622',NULL,1,'2024-06-10 13:23:33','public\\images\\anhlichsu\\2024-10-06 13 23 33_full.jpg','public\\images\\anhlichsu\\2024-06-10 13 23 33_crop.jpg'),(71,1,'A1 E4 0E 1B','15A16622',NULL,1,'2024-06-10 13:36:23','public\\images\\anhlichsu\\2024-10-06 13 36 23_full.jpg','public\\images\\anhlichsu\\2024-06-10 13 36 23_crop.jpg'),(72,1,'A1 E4 0E 1B','15A16622',1,1,'2024-06-10 13:47:00','public\\images\\anhlichsu\\2024-10-06 13 47 00_full.jpg','public\\images\\anhlichsu\\2024-06-10 13 47 00_crop.jpg'),(73,2,'A1 E4 0E 1B','15A16622',NULL,1,'2024-06-10 13:58:44','public\\images\\anhlichsu\\2024-10-06 13 58 44_full.jpg','public\\images\\anhlichsu\\2024-06-10 13 58 44_crop.jpg'),(74,1,'A1 E4 0E 1B','15A63635',NULL,1,'2024-06-10 14:05:05','public\\images\\anhlichsu\\2024-10-06 14 05 05_full.jpg','public\\images\\anhlichsu\\2024-06-10 14 05 05_crop.jpg'),(75,2,'11 9C A9 23','15A16622',1,1,'2024-06-10 17:50:05','public\\images\\anhlichsu\\2024-10-06 17 50 05_full.jpg','public\\images\\anhlichsu\\2024-06-10 17 50 05_crop.jpg'),(76,1,'11 9C A9 23','15A16622',1,1,'2024-06-10 18:05:43','public\\images\\anhlichsu\\2024-10-06 18 05 43_full.jpg','public\\images\\anhlichsu\\2024-06-10 18 05 43_crop.jpg');
/*!40000 ALTER TABLE `lichsu` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_insert_lichsu` AFTER INSERT ON `lichsu` FOR EACH ROW BEGIN
	DECLARE loaithe VARCHAR(20);
    DECLARE tencong VARCHAR(20);
    SELECT the.loaithe
        INTO loaithe
    	FROM the
        WHERE sothe = NEW.sothe;
    SELECT cong.tencong
    	INTO tencong
    	FROM cong
    	WHERE id_cong = NEW.id_cong; 
	IF (tencong LIKE '%vào%') THEN 
    	IF(loaithe = 'Thẻ cư dân') THEN
    		UPDATE xecudan SET inside = 1
    			WHERE xecudan.bienso = NEW.bienso;
		ELSEIF (loaithe = 'Thẻ vãng lai') THEN
        	UPDATE xevanglai SET inside = 1
    			WHERE xevanglai.bienso = NEW.bienso;
    	END IF;
	ELSEIF (tencong LIKE '%ra%') THEN
    	IF(loaithe = 'Thẻ cư dân') THEN
    		UPDATE xecudan SET inside = 0
    			WHERE xecudan.bienso = NEW.bienso;
		ELSEIF(loaithe = 'Thẻ vãng lai') THEN
    		UPDATE xevanglai SET inside = 0
    			WHERE xevanglai.bienso = NEW.bienso;
    	END IF;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mayquetthe`
--

DROP TABLE IF EXISTS `mayquetthe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mayquetthe` (
  `id_mayquetthe` int(11) NOT NULL AUTO_INCREMENT,
  `id_cong` int(11) NOT NULL,
  `tenmay` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_mayquetthe`),
  KEY `id_cong` (`id_cong`),
  CONSTRAINT `mayquetthe_ibfk_1` FOREIGN KEY (`id_cong`) REFERENCES `cong` (`id_cong`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mayquetthe`
--

LOCK TABLES `mayquetthe` WRITE;
/*!40000 ALTER TABLE `mayquetthe` DISABLE KEYS */;
INSERT INTO `mayquetthe` VALUES (1,1,'Máy vào A',1),(2,2,'Máy ra A',1);
/*!40000 ALTER TABLE `mayquetthe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhanvien`
--

DROP TABLE IF EXISTS `nhanvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhanvien` (
  `id_nhanvien` int(11) NOT NULL AUTO_INCREMENT,
  `hoten` varchar(20) NOT NULL,
  `ngayvaolam` date NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_nhanvien`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhanvien`
--

LOCK TABLES `nhanvien` WRITE;
/*!40000 ALTER TABLE `nhanvien` DISABLE KEYS */;
INSERT INTO `nhanvien` VALUES (1,'Phong Trần','2024-02-29',1),(2,'Phát Nguyễn','2024-03-06',1),(3,'Mây Đinh','2024-03-03',1);
/*!40000 ALTER TABLE `nhanvien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taikhoan` (
  `id_taikhoan` int(11) NOT NULL AUTO_INCREMENT,
  `id_khachhang` int(11) DEFAULT NULL,
  `id_nhanvien` int(11) DEFAULT NULL,
  `tendangnhap` varchar(20) NOT NULL,
  `matkhau` varchar(20) NOT NULL,
  `phanquyen` varchar(20) NOT NULL,
  PRIMARY KEY (`id_taikhoan`),
  KEY `id_khachhang` (`id_khachhang`),
  KEY `id_nhanvien` (`id_nhanvien`),
  CONSTRAINT `taikhoan_ibfk_1` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`),
  CONSTRAINT `taikhoan_ibfk_2` FOREIGN KEY (`id_nhanvien`) REFERENCES `nhanvien` (`id_nhanvien`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES (1,NULL,NULL,'admin','1','admin'),(2,NULL,1,'nvphong','1','nhanvien'),(3,NULL,2,'nvphat','1','nhanvien'),(4,NULL,3,'nvmay','1','nhanvien'),(5,1,NULL,'phong','1','khachhang'),(6,2,NULL,'phat','1','khachhang'),(7,3,NULL,'may','1','khachhang');
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `the`
--

DROP TABLE IF EXISTS `the`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `the` (
  `sothe` varchar(20) NOT NULL,
  `id_khachhang` int(11) DEFAULT NULL,
  `loaithe` varchar(20) NOT NULL,
  `ngaytaothe` date NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`sothe`),
  KEY `id_khachhang` (`id_khachhang`),
  CONSTRAINT `the_ibfk_1` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `the`
--

LOCK TABLES `the` WRITE;
/*!40000 ALTER TABLE `the` DISABLE KEYS */;
INSERT INTO `the` VALUES ('11 9C A9 23',1,'Thẻ cư dân','2024-04-30',1),('1A 0F 9C 17',2,'Thẻ cư dân','2024-06-06',1),('8C 20 81 9E',NULL,'Thẻ cư dân','2024-02-12',1),('A1 E4 0E 1B',NULL,'Thẻ vãng lai','2024-04-26',1),('F8 1A 2F 15',NULL,'Thẻ cư dân','2024-01-05',1),('F8 4C 2C 28',NULL,'Thẻ cư dân','2024-05-13',1),('F8 6B D4 32',NULL,'Thẻ vãng lai','2024-03-05',1),('F8 7E 4C 69',NULL,'Thẻ vãng lai','2024-06-07',1);
/*!40000 ALTER TABLE `the` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xecudan`
--

DROP TABLE IF EXISTS `xecudan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xecudan` (
  `id_phuongtien` int(11) NOT NULL AUTO_INCREMENT,
  `sothe` varchar(20) NOT NULL,
  `loaiphuongtien` varchar(20) NOT NULL,
  `bienso` varchar(20) NOT NULL,
  `inside` tinyint(1) NOT NULL DEFAULT 0,
  `path_anhphuongtien` varchar(255) NOT NULL,
  `path_anhbienso` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_phuongtien`),
  KEY `sothe` (`sothe`),
  CONSTRAINT `xecudan_ibfk_1` FOREIGN KEY (`sothe`) REFERENCES `the` (`sothe`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xecudan`
--

LOCK TABLES `xecudan` WRITE;
/*!40000 ALTER TABLE `xecudan` DISABLE KEYS */;
INSERT INTO `xecudan` VALUES (57,'11 9C A9 23','oto','15A16622',1,'public\\images\\anhxecudan\\1x.jpg','public\\images\\anhxecudan\\1s.jpg',1),(58,'11 9C A9 23','xe máy','15AT00229',0,'public\\images\\anhxecudan\\2x.jpg','public\\images\\anhxecudan\\2s.jpg',1),(59,'1A 0F 9C 17','xe máy','15B411686',1,'public\\images\\anhxecudan\\3x.jpg','public\\images\\anhxecudan\\3s.jpg',1);
/*!40000 ALTER TABLE `xecudan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xevanglai`
--

DROP TABLE IF EXISTS `xevanglai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xevanglai` (
  `id_phuongtien` int(11) NOT NULL AUTO_INCREMENT,
  `sothe` varchar(20) DEFAULT NULL,
  `bienso` varchar(20) NOT NULL,
  `inside` tinyint(1) NOT NULL DEFAULT 1,
  `path_anhphuongtien` varchar(255) NOT NULL,
  `path_anhbienso` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_phuongtien`),
  KEY `sothe` (`sothe`),
  CONSTRAINT `xevanglai_ibfk_1` FOREIGN KEY (`sothe`) REFERENCES `the` (`sothe`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xevanglai`
--

LOCK TABLES `xevanglai` WRITE;
/*!40000 ALTER TABLE `xevanglai` DISABLE KEYS */;
INSERT INTO `xevanglai` VALUES (20,NULL,'15A16622',0,'public\\images\\anhlichsu\\2024-10-06 13 51 17_full.jpg','public\\images\\anhlichsu\\2024-06-10 13 51 17_crop.jpg',0),(21,NULL,'15A63635',0,'public\\images\\anhlichsu\\2024-10-06 14 05 05_full.jpg','public\\images\\anhlichsu\\2024-06-10 14 05 05_crop.jpg',0),(22,'A1 E4 0E 1B','15A16622',1,'public\\images\\anhlichsu\\2024-10-06 14 07 52_full.jpg','public\\images\\anhlichsu\\2024-06-10 14 07 52_crop.jpg',1);
/*!40000 ALTER TABLE `xevanglai` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-12 13:42:51
