var db = require('../models/database');
var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const moment = require('moment');

router.get('/',  function (req, res, next) {
    // router.get('/', authMiddleware.isAdmin, function (req, res, next) {
    let sql = `SELECT lichsu.thoigianmo, cong.tencong, lichsu.sothe, lichsu.bienso, khachhang.hoten AS tenKH, nhanvien.hoten as tenNV, lichsu.path_anhphuongtien, lichsu.path_anhbienso
                FROM lichsu JOIN cong on lichsu.id_cong = cong.id_cong
                LEFT JOIN khachhang on lichsu.id_khachhang = khachhang.id_khachhang
                JOIN nhanvien on lichsu.id_nhanvien = nhanvien.id_nhanvien`;
    db.query(sql, function (err, data, fields) {
        res.render("lichsu", { list: data });
        console.log(data);
    });
});

router.get('/search/', function(req, res, next) {
    const keyword = req.query.keyword;
    console.log(keyword)
    const query = `SELECT lichsu.thoigianmo, cong.tencong, lichsu.sothe, lichsu.bienso, khachhang.hoten AS tenKH, nhanvien.hoten as tenNV, lichsu.path_anhphuongtien, lichsu.path_anhbienso
                    FROM lichsu JOIN cong on lichsu.id_cong = cong.id_cong
                    LEFT JOIN khachhang on lichsu.id_khachhang = khachhang.id_khachhang
                    JOIN nhanvien on lichsu.id_nhanvien = nhanvien.id_nhanvien
                    HAVING thoigianmo LIKE ? OR tencong LIKE ? OR sothe LIKE ? OR bienso LIKE ? OR tenKH LIKE ? OR tenNV LIKE ?`;
    const searchTerm = `%${keyword}%`; // Thêm dấu % cho tìm kiếm mở rộng
    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], function(err, result) {
        if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        } else {
            res.json(result); // Send search results back as JSON
            console.log(result)
        }
    });
});
module.exports = router;