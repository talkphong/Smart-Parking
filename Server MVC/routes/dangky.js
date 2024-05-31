var db = require('../models/database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('dangky');
});

router.post('/xulydangky', function(req, res, next){
  const {tendangnhap, matkhau, hoten, id_khachhang} = req.body
  let sql = `SELECT * FROM khachhang WHERE id_khachhang = ?`;
  db.query(sql, id_khachhang, function(err, results, fields) {
    if (results.length > 0) {
      const taikhoan = {tendangnhap: tendangnhap, matkhau: matkhau, id_khachhang: id_khachhang, phanquyen: "Khách hàng"}
      db.query('insert into taikhoan SET ?', taikhoan, function(err, data) {
        if (err) throw err;
        res.redirect("/dangnhap");
    });
    }else {
      console.log(`Không tìm thấy id khách hàng: ${id_khachhang}`)
    }
  })
});
module.exports = router;