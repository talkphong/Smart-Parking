var db = require('../models/database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('dangky');
});

router.post('/xulydangky', function(req, res, next){
  const {tendangnhap, matkhau, hoten, id_khachhang} = req.body
  const taikhoan = {tendangnhap: tendangnhap, matkhau: matkhau, hoten: hoten}
  console.log(taikhoan)
  // db.query(`INSERT INTO nhanvien SET ?`, nhanvien, function (err, data) {
  //   if (err) throw err;
  //   res.send("Dang ky thanh cong")
  // });
});
module.exports = router;