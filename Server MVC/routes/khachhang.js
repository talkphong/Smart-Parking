var db = require('../models/database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    // res.send('Danh sách khách hàng');  
    let sql = `SELECT khachhang.id_khachhang, the.sothe, khachhang.hoten, khachhang.socanho, COUNT(phuongtien.id_phuongtien) AS so_luong_phuongtien FROM khachhang LEFT JOIN phuongtien ON phuongtien.id_khachhang = khachhang.id_khachhang LEFT JOIN the ON the.id_khachhang = khachhang.id_khachhang GROUP BY khachhang.id_khachhang`;
    db.query(sql, function(err, data, fields) {      
        res.render("khachhang_list",{list:data});
        console.log(data);
    }); 
});
router.get('/form-them-khachhang', function(req, res, next) {
    // res.send('Form thêm khách hàng'); 
    res.render("khachhang_addnew");
});
router.post('/themkhachhang', function(req, res, next) {
  //nhận dữ liệu từ addnew để thêm record vào db
  let hoten = req.body.hoten;
  let socanho = req.body.socanho;
  let khachhang = {hoten:hoten, socanho:socanho}
  db.query('insert into khachhang SET ?', khachhang, function(err, data) {
    if (err) throw err;
    res.redirect("/khachhang");
  });
});
router.get('/sua-khachhang/:id', function(req, res, next) {
  //Lay id khach hang tu url
  const id = req.params.id;

  //Truy van
  db.query('SELECT khachhang.id_khachhang, the.sothe, khachhang.hoten, khachhang.socanho, COUNT(phuongtien.id_phuongtien) AS so_luong_phuongtien FROM khachhang LEFT JOIN phuongtien ON phuongtien.id_khachhang = khachhang.id_khachhang LEFT JOIN the ON the.id_khachhang = khachhang.id_khachhang WHERE khachhang.id_khachhang = ? GROUP BY khachhang.id_khachhang', id, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Nếu không tìm thấy khách hàng, trả về trang lỗi 404
    if (result.length === 0) {
      res.status(404).send('Không tìm thấy khách hàng');
      return;
    }

    // Render trang chỉnh sửa với dữ liệu khách hàng
    res.render('sua_khachhang', { khachhang: result[0], the: result[0] });
  });
});
router.post('/capnhat-khachhang/:id', function(req, res, next) {
  // Lấy ID của khách hàng từ URL
  const id = req.params.id;

  // Lấy thông tin mới từ form
  const newData = {
    sothe: req.body.sothe,
    hoten: req.body.hoten,
    socanho: req.body.socanho
  };

  // Cập nhật thông tin khách hàng trong database
  db.query(`UPDATE khachhang AS k
            INNER JOIN the AS t ON k.id_khachhang = t.id_khachhang
            SET t.sothe = ?, k.hoten = ?, k.socanho = ?
            WHERE k.id_khachhang = ?`, [newData.sothe, newData.hoten, newData.socanho, id], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Redirect về trang danh sách khách hàng sau khi cập nhật thành công
    res.redirect('/khachhang');
  });
});
router.get('/delete/:id', function(req, res) {
//   var id = req.params.id;
//   res.send('Xóa khách hàng' + id);
  let id_khachhang = req.params.id;
  let sql= "DELETE FROM `khachhang` WHERE id_khachhang = ?;";
  db.query(sql, [id_khachhang], function(err, data) {    
    if (data.affectedRows==0) {
        console.log(`Không có khách hàng ${id} để xóa`); 
    }
    res.redirect('/khachhang');
  })
});

router.get('/search', function(req, res, next) {
  const keyword = req.query.keyword;
  const query = `SELECT khachhang.id_khachhang, the.sothe, khachhang.hoten, khachhang.socanho, COUNT(phuongtien.id_phuongtien) AS so_luong_phuongtien 
                FROM khachhang JOIN the ON khachhang.id_khachhang = the.id_khachhang
                LEFT JOIN phuongtien ON phuongtien.id_khachhang = khachhang.id_khachhang
                WHERE khachhang.id_khachhang LIKE ? OR the.sothe LIKE ? OR khachhang.hoten LIKE ? OR khachhang.socanho LIKE ?
                GROUP BY khachhang.id_khachhang`;
  const searchTerm = `%${keyword}%`; // Thêm dấu % cho tìm kiếm mở rộng
  db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
        res.json(result); // Send search results back as JSON
    }
  });
});

module.exports = router;