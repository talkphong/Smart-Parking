var db = require('../models/database');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  let sql = `SELECT the.id_the, khachhang.hoten, the.sothe, the.loaithe, the.ngaytaothe, the.giatien 
              FROM the LEFT JOIN khachhang 
              ON the.id_khachhang = khachhang.id_khachhang 
              GROUP BY the.id_the`;
  db.query(sql, function (err, data, fields) {
    res.render("the", { list: data });
    console.log(data);
  });
});

router.get('/form-them-the', function (req, res, next) {
  res.render('them_the')
});

router.post('/themthe', function (req, res, next) {
  let id_khachhang = req.body.id_khachhang;
  let sothe = req.body.sothe;
  let loaithe = req.body.loaithe;
  let ngaytaothe = req.body.ngaytaothe;
  let giatien = req.body.giatien;
  let the = {id_khachhang:id_khachhang, sothe:sothe, loaithe:loaithe, ngaytaothe:ngaytaothe, giatien:giatien}
  db.query('INSERT INTO the SET ?', the, function(err, data){
    if (err) throw err;
    res.redirect("/the");
  });
});

module.exports = router;
