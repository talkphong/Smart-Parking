var db = require('../models/database');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    let sql = `SELECT id_nhanvien, hoten, ngayvaolam 
                FROM nhanvien GROUP BY id_nhanvien`;
    db.query(sql, function (err, data, fields) {
        res.render("nhanvien", { list: data });
        console.log(data);
    });
});

router.get('/form-them-nhanvien', function (req, res, next) {
    res.render('them_nhanvien');
});

router.post('/themnhanvien', function (req, res, next) {
    let hoten = req.body.hoten;
    let ngayvaolam = req.body.ngayvaolam;
    let nhanvien = {hoten: hoten, ngayvaolam: ngayvaolam }
    db.query(`INSERT INTO nhanvien SET ?`, nhanvien, function (err, data) {
        if (err) throw err;
        res.redirect("/nhanvien");
    });
});

module.exports = router;