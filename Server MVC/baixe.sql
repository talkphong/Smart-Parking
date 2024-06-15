-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 10, 2024 lúc 05:30 PM
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
(1, 1, 'Camera vào A', 'Hoạt động', 1),
(2, 2, 'Camera ra A', 'Hoạt động', 1);

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
(1, 'Trần Tuấn Phong', 'Skylake 04-01', 1),
(2, 'Nguyễn Trịnh Tấn Phát', 'Lotus 08-05', 1),
(3, 'Đinh Thị Mây', 'Sunshine 04-06', 1),
(4, 'Lê Minh Hiếu', 'Ocean 12-04', 1),
(5, 'Hoàng Thị Thùy Linh', 'Diamond 06-07', 1),
(6, 'Hoàng Trọng Nghĩa', 'Horizon 09-02', 1);

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
-- Đang đổ dữ liệu cho bảng `lichsu`
--

INSERT INTO `lichsu` (`id_lichsu`, `id_cong`, `sothe`, `bienso`, `id_khachhang`, `id_nhanvien`, `thoigianmo`, `path_anhphuongtien`, `path_anhbienso`) VALUES
(65, 1, '11 9C A9 23', '15A16622', 1, 1, '2024-06-10 12:03:01', 'public\\images\\anhlichsu\\2024-10-06 12 03 01_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 12 03 01_crop.jpg'),
(66, 1, '11 9C A9 23', '15AT00229', 1, 1, '2024-06-10 12:16:56', 'public\\images\\anhlichsu\\2024-10-06 12 16 56_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 12 16 56_crop.jpg'),
(67, 2, '11 9C A9 23', '15AT00229', 1, 1, '2024-06-10 12:51:21', 'public\\images\\anhlichsu\\2024-10-06 12 51 21_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 12 51 21_crop.jpg'),
(68, 1, '1A 0F 9C 17', '15B411686', 2, 1, '2024-06-10 13:16:56', 'public\\images\\anhlichsu\\2024-10-06 13 16 56_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 13 16 56_crop.jpg'),
(69, 2, '11 9C A9 23', '15A16622', 1, 1, '2024-06-10 13:21:46', 'public\\images\\anhlichsu\\2024-10-06 13 21 46_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 13 21 46_crop.jpg'),
(70, 1, 'A1 E4 0E 1B', '15A16622', NULL, 1, '2024-06-10 13:23:33', 'public\\images\\anhlichsu\\2024-10-06 13 23 33_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 13 23 33_crop.jpg'),
(71, 1, 'A1 E4 0E 1B', '15A16622', NULL, 1, '2024-06-10 13:36:23', 'public\\images\\anhlichsu\\2024-10-06 13 36 23_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 13 36 23_crop.jpg'),
(72, 1, 'A1 E4 0E 1B', '15A16622', 1, 1, '2024-06-10 13:47:00', 'public\\images\\anhlichsu\\2024-10-06 13 47 00_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 13 47 00_crop.jpg'),
(73, 2, 'A1 E4 0E 1B', '15A16622', NULL, 1, '2024-06-10 13:58:44', 'public\\images\\anhlichsu\\2024-10-06 13 58 44_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 13 58 44_crop.jpg'),
(74, 1, 'A1 E4 0E 1B', '15A63635', NULL, 1, '2024-06-10 14:05:05', 'public\\images\\anhlichsu\\2024-10-06 14 05 05_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 14 05 05_crop.jpg'),
(75, 2, '11 9C A9 23', '15A16622', 1, 1, '2024-06-10 17:50:05', 'public\\images\\anhlichsu\\2024-10-06 17 50 05_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 17 50 05_crop.jpg'),
(76, 1, '11 9C A9 23', '15A16622', 1, 1, '2024-06-10 18:05:43', 'public\\images\\anhlichsu\\2024-10-06 18 05 43_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 18 05 43_crop.jpg');

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
(1, 'Phong Trần', '2024-02-29', 1),
(2, 'Phát Nguyễn', '2024-03-06', 1),
(3, 'Mây Đinh', '2024-03-03', 1);

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
(1, NULL, NULL, 'admin', '1', 'admin'),
(2, NULL, 1, 'nvphong', '1', 'nhanvien'),
(3, NULL, 2, 'nvphat', '1', 'nhanvien'),
(4, NULL, 3, 'nvmay', '1', 'nhanvien'),
(5, 1, NULL, 'phong', '1', 'khachhang'),
(6, 2, NULL, 'phat', '1', 'khachhang'),
(7, 3, NULL, 'may', '1', 'khachhang');

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
('11 9C A9 23', 1, 'Thẻ cư dân', '2024-04-30', 1),
('1A 0F 9C 17', 2, 'Thẻ cư dân', '2024-06-06', 1),
('8C 20 81 9E', NULL, 'Thẻ cư dân', '2024-02-12', 1),
('A1 E4 0E 1B', NULL, 'Thẻ vãng lai', '2024-04-26', 1),
('F8 1A 2F 15', NULL, 'Thẻ cư dân', '2024-01-05', 1),
('F8 4C 2C 28', NULL, 'Thẻ cư dân', '2024-05-13', 1),
('F8 6B D4 32', NULL, 'Thẻ vãng lai', '2024-03-05', 1),
('F8 7E 4C 69', NULL, 'Thẻ vãng lai', '2024-06-07', 1);

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

--
-- Đang đổ dữ liệu cho bảng `xecudan`
--

INSERT INTO `xecudan` (`id_phuongtien`, `sothe`, `loaiphuongtien`, `bienso`, `inside`, `path_anhphuongtien`, `path_anhbienso`, `active`) VALUES
(57, '11 9C A9 23', 'oto', '15A16622', 1, 'public\\images\\anhxecudan\\1x.jpg', 'public\\images\\anhxecudan\\1s.jpg', 1),
(58, '11 9C A9 23', 'xe máy', '15AT00229', 0, 'public\\images\\anhxecudan\\2x.jpg', 'public\\images\\anhxecudan\\2s.jpg', 1),
(59, '1A 0F 9C 17', 'xe máy', '15B411686', 1, 'public\\images\\anhxecudan\\3x.jpg', 'public\\images\\anhxecudan\\3s.jpg', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xevanglai`
--

CREATE TABLE `xevanglai` (
  `id_phuongtien` int(11) NOT NULL,
  `sothe` varchar(20) DEFAULT NULL,
  `bienso` varchar(20) NOT NULL,
  `inside` tinyint(1) NOT NULL DEFAULT 1,
  `path_anhphuongtien` varchar(255) NOT NULL,
  `path_anhbienso` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `xevanglai`
--

INSERT INTO `xevanglai` (`id_phuongtien`, `sothe`, `bienso`, `inside`, `path_anhphuongtien`, `path_anhbienso`, `active`) VALUES
(20, NULL, '15A16622', 0, 'public\\images\\anhlichsu\\2024-10-06 13 51 17_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 13 51 17_crop.jpg', 0),
(21, NULL, '15A63635', 0, 'public\\images\\anhlichsu\\2024-10-06 14 05 05_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 14 05 05_crop.jpg', 0),
(22, 'A1 E4 0E 1B', '15A16622', 1, 'public\\images\\anhlichsu\\2024-10-06 14 07 52_full.jpg', 'public\\images\\anhlichsu\\2024-06-10 14 07 52_crop.jpg', 1);

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
  MODIFY `id_khachhang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `lichsu`
--
ALTER TABLE `lichsu`
  MODIFY `id_lichsu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

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
  MODIFY `id_taikhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `xecudan`
--
ALTER TABLE `xecudan`
  MODIFY `id_phuongtien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT cho bảng `xevanglai`
--
ALTER TABLE `xevanglai`
  MODIFY `id_phuongtien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
