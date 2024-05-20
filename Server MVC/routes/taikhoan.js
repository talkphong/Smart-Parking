var db = require('../models/database');
var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.isAdmin, function (req, res, next) {  
  let sql = `SELECT taikhoan.id_taikhoan, khachhang.hoten AS hoten_khachhang, nhanvien.hoten AS hoten_nhanvien, taikhoan.tendangnhap, taikhoan.matkhau, taikhoan.phanquyen
              FROM taikhoan LEFT JOIN khachhang ON taikhoan.id_khachhang = khachhang.id_khachhang
              LEFT JOIN nhanvien ON taikhoan.id_nhanvien = nhanvien.id_nhanvien`;
    db.query(sql, function (err, data, fields) {
        res.render("taikhoan_", { list: data });
        console.log(data);
    });
});

router.get('/form-them-taikhoan', (req, res) => {
    db.query('SELECT id_nhanvien FROM nhanvien', (error, nhanvienResults) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
        
        db.query('SELECT id_khachhang FROM khachhang', (error, khachhangResults) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Internal Server Error');
            }
            
            res.render('taikhoan_addnew', { listnhanvien: nhanvienResults, listkhachhang: khachhangResults});

        });
    });
});

// Route xử lý form thêm tài khoản
router.post('/themtaikhoan', async (req, res) => {
    const { them_id_khachhang, them_id_nhanvien, them_tendangnhap, them_matkhau, them_phanquyen } = req.body;
  
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

router.get('/taikhoan_update/:id', function(req, res) {
  //Lay id tai khoan tu url
  const id = req.params.id;
  //Truy van
  db.query('SELECT * FROM taikhoan WHERE id_taikhoan = ?', id, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Nếu không tìm thấy tài khoản, trả về trang lỗi 404
    if (result.length === 0) {
      res.status(404).send('Không tìm thấy tài khoản');
      return;
    }
    // Render trang chỉnh sửa với dữ liệu khách hàng
    res.render('taikhoan_update', { taikhoan: result[0] });
  });
})

router.post('/update_taikhoan', function(req, res) {
    // Lấy thông tin mới từ form
  const {id_taikhoan, id_khachhang, id_nhanvien, tendangnhap, matkhau, phanquyen} = req.body
  const newData = {id_taikhoan: id_taikhoan, id_khachhang: id_khachhang, id_nhanvien: id_nhanvien, tendangnhap: tendangnhap, matkhau: matkhau, phanquyen: phanquyen}

    // Cập nhật thông tin tài khoản trong database
  db.query(`UPDATE taikhoan 
            SET id_khachhang = ?, id_nhanvien = ?, tendangnhap = ?, matkhau = ?, phanquyen = ?
            WHERE id_taikhoan = ?`, [newData.id_khachhang || null, newData.id_nhanvien || null, newData.tendangnhap, newData.matkhau, newData.phanquyen, newData.id_taikhoan], function(err, result) {
    if (err) throw err;
    // Redirect về trang danh sách tài khoản sau khi cập nhật thành công
    res.send("Cập nhật tài khoản thành công");
  });
})

router.get('/taikhoan_delete/:id', function(req, res) {
    let id_taikhoan = req.params.id;
    console.log(id_taikhoan)
    let sql= "DELETE FROM `taikhoan` WHERE id_taikhoan = ?;";
    db.query(sql, [id_taikhoan], function(err, data) {    
      if (data.affectedRows==0) {
          console.log(`Không có tài khoản ${id} để xóa`); 
      }
      res.redirect('/taikhoan');
    })
  }); 

  
router.get('/search/', function(req, res, next) {
  const keyword = req.query.keyword;
  const query = `SELECT taikhoan.id_taikhoan, khachhang.hoten AS hoten_khachhang, nhanvien.hoten AS hoten_nhanvien, taikhoan.tendangnhap, taikhoan.matkhau, taikhoan.phanquyen
                FROM taikhoan LEFT JOIN khachhang ON taikhoan.id_khachhang = khachhang.id_khachhang
                LEFT JOIN nhanvien ON taikhoan.id_nhanvien = nhanvien.id_nhanvien
                HAVING id_taikhoan LIKE ? OR hoten_khachhang LIKE ? OR hoten_nhanvien LIKE ? OR tendangnhap LIKE ? OR matkhau LIKE ? OR phanquyen LIKE ?`;
  const searchTerm = `%${keyword}%`; // Thêm dấu % cho tìm kiếm mở rộng
  db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
        res.json(result); // Send search results back as JSON
    }
  });
});

module.exports = router;