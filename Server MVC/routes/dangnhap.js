// const session = require('express-session');

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
      req.session.user = results[0].phanquyen;
      switch (req.session.user){
        case "Admin":
          res.redirect('../index', { title: results[0].tendangnhap });
          break;
        case "Nhân viên":
          res.redirect('../camera');
          break;
        case "Khách hàng":
          res.redirect('../khachhang');
          break;
      }
      // res.send(`Đăng nhập thành công, quyền người dùng là: ${results[0].phanquyen}`)
    } else {
      res.status(401).send("Ten dang nhap hoac mat khau khong dung");
    }
  });
});



  
  module.exports = router;