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
  const { tendangnhap, matkhau } = req.body;
  let sql = `SELECT tendangnhap, matkhau, phanquyen FROM taikhoan WHERE tendangnhap = ? AND matkhau = ?`;
  db.query(sql, [tendangnhap, matkhau], function(err, results, fields) {
    if (err) {
      res.status(500).send("Loi truy van co so du lieu");
      return;
    }

    if (results.length > 0) {
      res.send(`Đăng nhập thành công, quyền người dùng là: ${results[0].phanquyen}`)
    } else {
      res.status(401);
    }
  });
});



  
  module.exports = router;