-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 29, 2024 lúc 03:00 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `baixe`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `camera`
--

CREATE TABLE `camera` (
  `id_camera` int(11) NOT NULL,
  `id_cong` int(11) NOT NULL,
  `tencamera` varchar(20) NOT NULL,
  `trangthai` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `camera`
--

INSERT INTO `camera` (`id_camera`, `id_cong`, `tencamera`, `trangthai`, `active`) VALUES
(1, 1, 'Camera vào A', 'Hoạt động]', 1),
(2, 2, 'Camera ra A', 'Hoạt động]', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cong`
--

CREATE TABLE `cong` (
  `id_cong` int(11) NOT NULL,
  `tencong` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cong`
--

INSERT INTO `cong` (`id_cong`, `tencong`) VALUES
(1, 'Cổng vào A'),
(2, 'Cổng ra A');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

CREATE TABLE `khachhang` (
  `id_khachhang` int(11) NOT NULL,
  `hoten` varchar(50) NOT NULL,
  `socanho` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`id_khachhang`, `hoten`, `socanho`, `active`) VALUES
(1, 'Trần Tuấn Phong', 'LOTUS 10-23', 1),
(2, 'Nguyễn Trịnh Tấn Phát', 'VENICE 01-01', 1),
(3, 'Đinh Thị Mây', 'PARIS 12-03', 1),
(4, 'Lê Minh Hiếu', 'MONACO 01-01', 1),
(6, 'Lee Hieu', 'A4310', 1),
(7, '33', '33', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichsu`
--

CREATE TABLE `lichsu` (
  `id_lichsu` int(11) NOT NULL,
  `id_cong` int(11) NOT NULL,
  `sothe` varchar(20) NOT NULL,
  `bienso` varchar(20) NOT NULL,
  `id_khachhang` int(11) DEFAULT NULL,
  `id_nhanvien` int(11) NOT NULL,
  `thoigianmo` datetime NOT NULL DEFAULT current_timestamp(),
  `path_anhphuongtien` varchar(255) NOT NULL,
  `path_anhbienso` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bẫy `lichsu`
--
DELIMITER $$
CREATE TRIGGER `after_insert_lichsu` AFTER INSERT ON `lichsu` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mayquetthe`
--

CREATE TABLE `mayquetthe` (
  `id_mayquetthe` int(11) NOT NULL,
  `id_cong` int(11) NOT NULL,
  `tenmay` varchar(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `mayquetthe`
--

INSERT INTO `mayquetthe` (`id_mayquetthe`, `id_cong`, `tenmay`, `active`) VALUES
(1, 1, 'Máy vào A', 1),
(2, 2, 'Máy ra A', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhanvien`
--

CREATE TABLE `nhanvien` (
  `id_nhanvien` int(11) NOT NULL,
  `hoten` varchar(20) NOT NULL,
  `ngayvaolam` date NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhanvien`
--

INSERT INTO `nhanvien` (`id_nhanvien`, `hoten`, `ngayvaolam`, `active`) VALUES
(1, 'Phát Nguyễn', '0000-00-00', 1),
(2, 'Phong Trần', '2024-03-16', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `id_taikhoan` int(11) NOT NULL,
  `id_khachhang` int(11) DEFAULT NULL,
  `id_nhanvien` int(11) DEFAULT NULL,
  `tendangnhap` varchar(20) NOT NULL,
  `matkhau` varchar(20) NOT NULL,
  `phanquyen` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`id_taikhoan`, `id_khachhang`, `id_nhanvien`, `tendangnhap`, `matkhau`, `phanquyen`) VALUES
(1, 1, NULL, 'phong', '1', 'khachhang'),
(2, 2, NULL, 'phat', '1', 'khachhang'),
(3, 3, NULL, 'may', '1', 'khachhang'),
(4, 4, NULL, 'hieu', '1', 'khachhang'),
(5, NULL, 1, 'nvphat', '1', 'nhanvien'),
(6, NULL, 2, 'nvphong', '1', 'nhanvien'),
(8, 1, 1, 'admin', '1', 'admin'),
(12, 6, NULL, 'hieu1', '1', 'khachhang'),
(13, NULL, NULL, 'admin1', '1', 'admin');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `the`
--

CREATE TABLE `the` (
  `sothe` varchar(20) NOT NULL,
  `id_khachhang` int(11) DEFAULT NULL,
  `loaithe` varchar(20) NOT NULL,
  `ngaytaothe` date NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `the`
--

INSERT INTO `the` (`sothe`, `id_khachhang`, `loaithe`, `ngaytaothe`, `active`) VALUES
('11 9C A9 23', NULL, 'Thẻ vãng lai', '2024-05-27', 1),
('A1 68 11', 7, 'Thẻ cư dân', '2024-05-24', 1),
('A1 68 22', 2, 'Thẻ cư dân', '2024-05-24', 1),
('A1 68 33', 3, 'Thẻ cư dân', '2024-05-24', 1),
('A1 68 44', 4, 'Thẻ cư dân', '2024-05-24', 1),
('A1 E4 0E 1B', 6, 'Thẻ cư dân', '2024-05-27', 1),
('B1 68 11', 1, 'Thẻ cư dân', '2024-05-25', 1),
('B1 68 22', NULL, 'Thẻ vãng lai', '2024-05-24', 1),
('B1 68 33', NULL, 'Thẻ vãng lai', '2024-05-24', 1),
('B1 68 44', NULL, 'Thẻ vãng lai', '2024-05-24', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xecudan`
--

CREATE TABLE `xecudan` (
  `id_phuongtien` int(11) NOT NULL,
  `sothe` varchar(20) NOT NULL,
  `loaiphuongtien` varchar(20) NOT NULL,
  `bienso` varchar(20) NOT NULL,
  `inside` tinyint(1) NOT NULL DEFAULT 0,
  `path_anhphuongtien` varchar(255) NOT NULL,
  `path_anhbienso` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xevanglai`
--

CREATE TABLE `xevanglai` (
  `id_phuongtien` int(11) NOT NULL,
  `sothe` varchar(20) NOT NULL,
  `bienso` varchar(20) NOT NULL,
  `inside` tinyint(1) NOT NULL DEFAULT 1,
  `path_anhphuongtien` varchar(255) NOT NULL,
  `path_anhbienso` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `camera`
--
ALTER TABLE `camera`
  ADD PRIMARY KEY (`id_camera`),
  ADD KEY `id_cong` (`id_cong`);

--
-- Chỉ mục cho bảng `cong`
--
ALTER TABLE `cong`
  ADD PRIMARY KEY (`id_cong`);

--
-- Chỉ mục cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`id_khachhang`);

--
-- Chỉ mục cho bảng `lichsu`
--
ALTER TABLE `lichsu`
  ADD PRIMARY KEY (`id_lichsu`),
  ADD KEY `id_cong` (`id_cong`),
  ADD KEY `id_nhanvien` (`id_nhanvien`),
  ADD KEY `sothe` (`sothe`),
  ADD KEY `id_khachhang` (`id_khachhang`);

--
-- Chỉ mục cho bảng `mayquetthe`
--
ALTER TABLE `mayquetthe`
  ADD PRIMARY KEY (`id_mayquetthe`),
  ADD KEY `id_cong` (`id_cong`);

--
-- Chỉ mục cho bảng `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD PRIMARY KEY (`id_nhanvien`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`id_taikhoan`),
  ADD KEY `id_khachhang` (`id_khachhang`),
  ADD KEY `id_nhanvien` (`id_nhanvien`);

--
-- Chỉ mục cho bảng `the`
--
ALTER TABLE `the`
  ADD PRIMARY KEY (`sothe`),
  ADD KEY `id_khachhang` (`id_khachhang`);

--
-- Chỉ mục cho bảng `xecudan`
--
ALTER TABLE `xecudan`
  ADD PRIMARY KEY (`id_phuongtien`),
  ADD KEY `sothe` (`sothe`);

--
-- Chỉ mục cho bảng `xevanglai`
--
ALTER TABLE `xevanglai`
  ADD PRIMARY KEY (`id_phuongtien`),
  ADD KEY `sothe` (`sothe`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `camera`
--
ALTER TABLE `camera`
  MODIFY `id_camera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `cong`
--
ALTER TABLE `cong`
  MODIFY `id_cong` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `id_khachhang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `lichsu`
--
ALTER TABLE `lichsu`
  MODIFY `id_lichsu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT cho bảng `mayquetthe`
--
ALTER TABLE `mayquetthe`
  MODIFY `id_mayquetthe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `nhanvien`
--
ALTER TABLE `nhanvien`
  MODIFY `id_nhanvien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `id_taikhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `xecudan`
--
ALTER TABLE `xecudan`
  MODIFY `id_phuongtien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT cho bảng `xevanglai`
--
ALTER TABLE `xevanglai`
  MODIFY `id_phuongtien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `camera`
--
ALTER TABLE `camera`
  ADD CONSTRAINT `camera_ibfk_1` FOREIGN KEY (`id_cong`) REFERENCES `cong` (`id_cong`);

--
-- Các ràng buộc cho bảng `lichsu`
--
ALTER TABLE `lichsu`
  ADD CONSTRAINT `lichsu_ibfk_1` FOREIGN KEY (`id_cong`) REFERENCES `cong` (`id_cong`),
  ADD CONSTRAINT `lichsu_ibfk_2` FOREIGN KEY (`id_nhanvien`) REFERENCES `nhanvien` (`id_nhanvien`),
  ADD CONSTRAINT `lichsu_ibfk_3` FOREIGN KEY (`sothe`) REFERENCES `the` (`sothe`),
  ADD CONSTRAINT `lichsu_ibfk_4` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`);

--
-- Các ràng buộc cho bảng `mayquetthe`
--
ALTER TABLE `mayquetthe`
  ADD CONSTRAINT `mayquetthe_ibfk_1` FOREIGN KEY (`id_cong`) REFERENCES `cong` (`id_cong`);

--
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `taikhoan_ibfk_1` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`),
  ADD CONSTRAINT `taikhoan_ibfk_2` FOREIGN KEY (`id_nhanvien`) REFERENCES `nhanvien` (`id_nhanvien`);

--
-- Các ràng buộc cho bảng `the`
--
ALTER TABLE `the`
  ADD CONSTRAINT `the_ibfk_1` FOREIGN KEY (`id_khachhang`) REFERENCES `khachhang` (`id_khachhang`);

--
-- Các ràng buộc cho bảng `xecudan`
--
ALTER TABLE `xecudan`
  ADD CONSTRAINT `xecudan_ibfk_1` FOREIGN KEY (`sothe`) REFERENCES `the` (`sothe`);

--
-- Các ràng buộc cho bảng `xevanglai`
--
ALTER TABLE `xevanglai`
  ADD CONSTRAINT `xevanglai_ibfk_1` FOREIGN KEY (`sothe`) REFERENCES `the` (`sothe`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
