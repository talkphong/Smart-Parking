var db = require('../models/database');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    let sql = `SELECT phuongtien.id_phuongtien, khachhang.hoten, 
                phuongtien.bienso, phuongtien.loaiphuongtien, 
                phuongtien.path_anhphuongtien, 
                phuongtien.path_anhbienso
                FROM phuongtien LEFT JOIN khachhang 
                ON phuongtien.id_khachhang = khachhang.id_khachhang
                GROUP BY phuongtien.id_phuongtien`;
    db.query(sql, function (err, data, fields) {
        res.render("phuongtien", { list: data });
        console.log(data);
    });
});


module.exports = router;