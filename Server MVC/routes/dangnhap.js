var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var db = require('../models/database');

router.use(bodyParser.urlencoded({extended: true}));

router.get('/', function(req, res, next) {
  res.render('dangnhap');
});

router.post('/xulydangnhap', function(req, res, next) {
  let tendangnhap = req.body.tendangnhap;
  let matkhau = req.body.matkhau;
  let sql = `SELECT tendangnhap, matkhau FROM taikhoan WHERE tendangnhap = ? AND matkhau = ?`;
  db.query(sql, [tendangnhap, matkhau], function(err, results, fields) {
    if (err) {
      res.status(500).send("Loi truy van co so du lieu");
      return;
    }

    if (results.length > 0) {
      res.redirect('/index.html');
    } else {
      res.status(401).send("Ten dang nhap hoac mat khau khong dung");
    }
  });
});



  
  module.exports = router;