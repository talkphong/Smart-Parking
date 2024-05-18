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
  let sql = `SELECT taikhoan.tendangnhap, taikhoan.matkhau, taikhoan.phanquyen, khachhang.id_khachhang, khachhang.hoten FROM taikhoan LEFT JOIN khachhang ON taikhoan.id_khachhang = khachhang.id_khachhang WHERE tendangnhap = ? AND matkhau = ?`;
  db.query(sql, [tendangnhap, matkhau], function(err, results, fields) {
    if (err) {
      res.status(500).send("Loi truy van co so du lieu");
      return;
    }

    if (results.length > 0) {
      req.session.user = {
        tendangnhap: results[0].tendangnhap,
        phanquyen: results[0].phanquyen,
        id_khachhang: results[0].id_khachhang, // Lưu id_khachhang vào session
        hoten: results[0].hoten // Lưu hoten vào session
      };
      switch (results[0].phanquyen){
        case "admin":
          res.redirect('../index');
          break;
        case "nhanvien":
          res.redirect('../camera');
          break;
        case "khachhang":
          res.redirect('../customer');
          break;
          default:
            res.status(401).send("Phân quyền không hợp lệ");
      }
      // res.send(`Đăng nhập thành công, quyền người dùng là: ${results[0].phanquyen}`)
    } else {
      res.status(401).send("Ten dang nhap hoac mat khau khong dung");
    }
  });
});



  
module.exports = router;