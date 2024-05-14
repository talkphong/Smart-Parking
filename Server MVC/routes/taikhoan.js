var db = require('../models/database');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) { 
    let sql = `SELECT taikhoan.id_taikhoan, khachhang.hoten AS hoten_khachhang, nhanvien.hoten AS hoten_nhanvien, taikhoan.tendangnhap, taikhoan.matkhau, taikhoan.phanquyen
                FROM taikhoan LEFT JOIN khachhang ON taikhoan.id_khachhang = khachhang.id_khachhang
                LEFT JOIN nhanvien ON taikhoan.id_nhanvien = nhanvien.id_nhanvien`;
    db.query(sql, function (err, data, fields) {
        res.render("taikhoan", { list: data });
        console.log(data);
    });
});

router.get('/form-them-taikhoan', (req, res) => {
    db.query('SELECT id_khachhang FROM khachhang', (error, khachhangResults) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
        
        db.query('SELECT id_nhanvien FROM nhanvien', (error, nhanvienResults) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Internal Server Error');
            }
            
            res.render('them_taikhoan', { listkhachhang: khachhangResults, listnhanvien: nhanvienResults });
        });
    });
});

// Route xử lý form thêm tài khoản
router.post('/themtaikhoan', async (req, res) => {
    const { them_id_khachhang, them_id_nhanvien, them_tendangnhap, them_matkhau, them_phanquyen } = req.body;
  
    if ((!them_id_khachhang && !them_id_nhanvien) || !them_tendangnhap || !them_matkhau || !them_phanquyen) {
      return res.status(400).send('Vui lòng nhập đầy đủ thông tin');
    }
  
    try {
      await db.query(
        'INSERT INTO taikhoan (id_khachhang, id_nhanvien, tendangnhap, matkhau, phanquyen) VALUES (?, ?, ?, ?, ?)',
        [them_id_khachhang || null, them_id_nhanvien || null, them_tendangnhap, them_matkhau, them_phanquyen]
      );
      res.redirect('/taikhoan');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

module.exports = router;