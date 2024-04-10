var db = require('../models/database');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    let sql = `SELECT khachhang.id_khachhang, the.sothe, khachhang.hoten, khachhang.socanho, COUNT(phuongtien.id_phuongtien) AS soluong_phuongtien FROM khachhang LEFT JOIN the ON khachhang.id_khachhang = the.id_khachhang LEFT JOIN phuongtien ON khachhang.id_khachhang = phuongtien.id_khachhang GROUP BY khachhang.id_khachhang`;
    db.query(sql, function (err, data, fields) {
        res.render('khachhang',{list:data});
        console.log(data);
    });
});


module.exports = router;