-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2024 at 03:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `baixe`
--

-- --------------------------------------------------------

--
-- Table structure for table `camera`
--

CREATE TABLE `camera` (
  `id_camera` int(11) NOT NULL,
  `tencamera` varchar(50) NOT NULL,
  `trangthai` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `camera`
--

INSERT INTO `camera` (`id_camera`, `tencamera`, `trangthai`) VALUES
(1, 'CAMIN', 'Hoạt động'),
(2, 'CAMOUT', 'Hoạt động');

-- --------------------------------------------------------

--
-- Table structure for table `cong`
--

CREATE TABLE `cong` (
  `id_cong` int(11) NOT NULL,
  `tencong` varchar(255) NOT NULL,
  `trangthai` varchar(255) DEFAULT NULL,
  `thoigianmo` datetime DEFAULT current_timestamp(),
  `thoigiandong` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cong`
--

INSERT INTO `cong` (`id_cong`, `tencong`, `trangthai`, `thoigianmo`, `thoigiandong`) VALUES
(1, 'Cổng vào A', '', '2024-05-18 16:15:45', '2024-05-18 16:15:45'),
(2, 'Cổng ra A', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `khachhang`
--

CREATE TABLE `khachhang` (
  `id_khachhang` int(11) NOT NULL,
  `hoten` varchar(255) NOT NULL,
  `socanho` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `khachhang`
--

INSERT INTO `khachhang` (`id_khachhang`, `hoten`, `socanho`) VALUES
(1, 'Trần Tuấn Phong', 'LOTUS10-22'),
(2, 'Nguyễn Trịnh Tấn Phát', 'LOTUS10-23'),
(3, 'Lee Minh Hieu', 'PARIS 12-03'),
(4, 'Nguyễn Thanh Bình', 'VENICE 01-02'),
(5, 'Hoàng Thị Thùy Linh', 'MONACO 01-01'),
(6, 'Nguyễn Thái Minh', 'VENICE 01-01'),
(7, 'Phạm Minh Thái', 'TNH430');

-- --------------------------------------------------------

--
-- Table structure for table `lichsu`
--

CREATE TABLE `lichsu` (
  `id_lichsu` int(11) NOT NULL,
  `id_nhanvien` int(11) NOT NULL,
  `id_cong` int(11) NOT NULL,
  `id_mayquetthe` int(11) NOT NULL,
  `id_camera` int(11) NOT NULL,
  `id_khachhang` int(11) NOT NULL,
  `id_the` int(11) NOT NULL,
  `id_phuongtien` int(11) NOT NULL,
  `thoigianra` datetime DEFAULT current_timestamp(),
  `thoigianvao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lichsu`
--

INSERT INTO `lichsu` (`id_lichsu`, `id_nhanvien`, `id_cong`, `id_mayquetthe`, `id_camera`, `id_khachhang`, `id_the`, `id_phuongtien`, `thoigianra`, `thoigianvao`) VALUES
(1, 3, 1, 1, 1, 1, 1, 1, NULL, '2024-05-17 16:33:44'),
(2, 3, 2, 2, 2, 1, 1, 1, '2024-05-18 16:17:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mayquetthe`
--

CREATE TABLE `mayquetthe` (
  `id_mayquetthe` int(11) NOT NULL,
  `id_cong` int(11) NOT NULL,
  `id_camera` int(11) NOT NULL,
  `id_the` int(11) DEFAULT NULL,
  `tenmay` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mayquetthe`
--

INSERT INTO `mayquetthe` (`id_mayquetthe`, `id_cong`, `id_camera`, `id_the`, `tenmay`) VALUES
(1, 1, 1, 6, 'Máy vào'),
(2, 2, 2, 6, 'Máy ra');

-- --------------------------------------------------------

--
-- Table structure for table `nhanvien`
--

CREATE TABLE `nhanvien` (
  `id_nhanvien` int(11) NOT NULL,
  `id_cong` int(11) DEFAULT NULL,
  `hoten` varchar(255) NOT NULL,
  `ngayvaolam` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nhanvien`
--

INSERT INTO `nhanvien` (`id_nhanvien`, `id_cong`, `hoten`, `ngayvaolam`) VALUES
(1, 1, 'Phong Trần', '2024-04-05'),
(2, 1, 'Phát Nguyễn', '2024-04-05'),
(3, 2, 'Hiếu Lê', '2024-04-05'),
(4, NULL, 'Lee Minh Hieu', '2024-05-14');

-- --------------------------------------------------------

--
-- Table structure for table `phuongtien`
--

CREATE TABLE `phuongtien` (
  `id_phuongtien` int(11) NOT NULL,
  `id_khachhang` int(11) NOT NULL,
  `bienso` varchar(50) NOT NULL,
  `loaiphuongtien` varchar(50) NOT NULL,
  `path_anhphuongtien` varchar(255) NOT NULL,
  `path_anhbienso` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phuongtien`
--

INSERT INTO `phuongtien` (`id_phuongtien`, `id_khachhang`, `bienso`, `loaiphuongtien`, `path_anhphuongtien`, `path_anhbienso`) VALUES
(1, 1, '15B397428', 'Xe máy', '/public/images/anhphuongtien/1/2933362ce1ae682e4b699c0481c097cc.jpg', '/public/images/anhbienso/1/2c462ab845c8a91ac0ef9b5feb249bdf.jpg'),
(2, 1, '15B413594', 'Ô tô', '/public/images/anhphuongtien/1/2933362ce1ae682e4b699c0481c097cc.jpg', '/public/images/anhbienso/1/2c462ab845c8a91ac0ef9b5feb249bdf.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `taikhoan`
--

CREATE TABLE `taikhoan` (
  `id_taikhoan` int(11) NOT NULL,
  `id_khachhang` int(11) DEFAULT NULL,
  `id_nhanvien` int(11) DEFAULT NULL,
  `tendangnhap` varchar(255) NOT NULL,
  `matkhau` varchar(255) NOT NULL,
  `phanquyen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `taikhoan`
--

INSERT INTO `taikhoan` (`id_taikhoan`, `id_khachhang`, `id_nhanvien`, `tendangnhap`, `matkhau`, `phanquyen`) VALUES
(1, NULL, 1, 'phongtran', '89940', 'admin'),
(2, NULL, 2, 'phatnguyen', '86940', 'admin'),
(3, NULL, 3, 'hieule', '123456', 'nhanvien'),
(4, 1, NULL, 'phong', '89940', 'khachhang'),
(5, 6, NULL, 'minhcaca', 'thaiminh', 'khachhang'),
(6, NULL, 4, 'leehieu', 'hieulee', 'nhanvien'),
(7, 7, NULL, 'mocmeo', '050302', 'khachhang');

-- --------------------------------------------------------

--
-- Table structure for table `the`
--

CREATE TABLE `the` (
  `id_the` int(11) NOT NULL,
  `id_khachhang` int(11) DEFAULT NULL,
  `sothe` varchar(50) NOT NULL,
  `loaithe` varchar(50) NOT NULL,
  `ngaytaothe` date NOT NULL,
  `giatien` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `the`
--

INSERT INTO `the` (`id_the`, `id_khachhang`, `sothe`, `loaithe`, `ngaytaothe`, `giatien`) VALUES
(1, 1, '89940', 'Thẻ VIP', '2024-04-04', '0đ'),
(2, 2, '86940', 'Thẻ VIP', '2024-04-04', '0đ'),
(3, 3, '12345', 'Thẻ VIP', '2024-05-02', '0đ'),
(4, 5, '88888', 'Thẻ VIP', '2024-05-02', '0đ'),
(5, 4, '112233', 'Thẻ VIP', '2024-05-14', '0đ'),
(6, 6, '332244', 'Thẻ VIP', '2024-05-14', '0đ');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `camera`
--
ALTER TABLE `camera`
  ADD PRIMARY KEY (`id_camera`);

--
-- Indexes for table `cong`
--
ALTER TABLE `cong`
  ADD PRIMARY KEY (`id_cong`);

--
-- Indexes for table `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`id_khachhang`);

--
-- Indexes for table `lichsu`
--
ALTER TABLE `lichsu`
  ADD PRIMARY KEY (`id_lichsu`),
  ADD KEY `id_nhanvien` (`id_nhanvien`),
  ADD KEY `id_cong` (`id_cong`),
  ADD KEY `id_mayquetthe` (`id_mayquetthe`),
  ADD KEY `id_camera` (`id_camera`),
  ADD KEY `id_khachhang` (`id_khachhang`),
  ADD KEY `id_the` (`id_the`),
  ADD KEY `id_phuongtien` (`id_phuongtien`);

--
-- Indexes for table `mayquetthe`
--
ALTER TABLE `mayquetthe`
  ADD PRIMARY KEY (`id_mayquetthe`),
  ADD KEY `id_camera` (`id_camera`),
  ADD KEY `id_cong` (`id_cong`),
  ADD KEY `id_the` (`id_the`);

--
-- Indexes for table `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD PRIMARY KEY (`id_nhanvien`),
  ADD KEY `id_cong` (`id_cong`);

--
-- Indexes for table `phuongtien`
--
ALTER TABLE `phuongtien`
  ADD PRIMARY KEY (`id_phuongtien`),
  ADD KEY `id_khachhang` (`id_khachhang`);

--
-- Indexes for table `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`id_taikhoan`),
  ADD KEY `id_khachhang` (`id_khachhang`),
  ADD KEY `id_nhanvien` (`id_nhanvien`);

--
-- Indexes for table `the`
--
ALTER TABLE `the`
  ADD PRIMARY KEY (`id_the`),
  ADD KEY `id_khachhang` (`id_khachhang`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `camera`
--
ALTER TABLE `camera`
  MODIFY `id_camera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cong`
--
ALTER TABLE `cong`
  MODIFY `id_cong` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `id_khachhang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `lichsu`
--
ALTER TABLE `lichsu`
  MODIFY `id_lichsu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mayquetthe`
--
ALTER TABLE `mayquetthe`
  MODIFY `id_mayquetthe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `nhanvien`
--
ALTER TABLE `nhanvien`
  MODIFY `id_nhanvien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `phuongtien`
--
ALTER TABLE `phuongtien`
  MODIFY `id_phuongtien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `id_taikhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `the`
--
ALTER TABLE `the`
  MODIFY `id_the` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `lichsu`
--
ALTER TABLE `lichsu`
  ADD CONSTRAINT `lichsu_ibfk_1` FOREIGN KEY (`id_nhanvien`) REFERENCES `nhanvien` (`id_nhanvien`),
  ADD CONSTRAINT `lichsu_ibfk_2` FOREIGN KEY (`id_cong`) REFERENCES `cong` (`id_cong`),
  ADD CONSTRAINT `lichsu_ibfk_3` FOREIGN KEY (`id_mayquetthe`) REFERENCES `mayquetthe` (`id_mayquetthe`),
  ADD CONSTRAINT `lichsu_ibfk_4` FOREIGN KEY (`id_camera`) REFERENCES `camera` (`id_camera`),
  ADD CONSTRAINT `lichsu_ibfk_5` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`),
  ADD CONSTRAINT `lichsu_ibfk_6` FOREIGN KEY (`id_the`) REFERENCES `the` (`id_the`),
  ADD CONSTRAINT `lichsu_ibfk_7` FOREIGN KEY (`id_phuongtien`) REFERENCES `phuongtien` (`id_phuongtien`);

--
-- Constraints for table `mayquetthe`
--
ALTER TABLE `mayquetthe`
  ADD CONSTRAINT `mayquetthe_ibfk_1` FOREIGN KEY (`id_camera`) REFERENCES `camera` (`id_camera`),
  ADD CONSTRAINT `mayquetthe_ibfk_2` FOREIGN KEY (`id_cong`) REFERENCES `cong` (`id_cong`),
  ADD CONSTRAINT `mayquetthe_ibfk_3` FOREIGN KEY (`id_the`) REFERENCES `the` (`id_the`);

--
-- Constraints for table `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD CONSTRAINT `nhanvien_ibfk_1` FOREIGN KEY (`id_cong`) REFERENCES `cong` (`id_cong`);

--
-- Constraints for table `phuongtien`
--
ALTER TABLE `phuongtien`
  ADD CONSTRAINT `phuongtien_ibfk_1` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`);

--
-- Constraints for table `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `taikhoan_ibfk_1` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`),
  ADD CONSTRAINT `taikhoan_ibfk_2` FOREIGN KEY (`id_nhanvien`) REFERENCES `nhanvien` (`id_nhanvien`);

--
-- Constraints for table `the`
--
ALTER TABLE `the`
  ADD CONSTRAINT `the_ibfk_1` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
