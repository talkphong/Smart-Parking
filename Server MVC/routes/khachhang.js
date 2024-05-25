const { isAdmin } = require('../middleware/authMiddleware');
var db = require('../models/database');
const authMiddleware = require('../middleware/authMiddleware');

var express = require('express');
var router = express.Router();

  router.get('/', authMiddleware.isAdmin, function(req, res, next) {
    // res.send('Danh sách khách hàng');  
    let sql = `SELECT khachhang.id_khachhang, the.sothe, khachhang.hoten, khachhang.socanho, COUNT(CASE WHEN xecudan.active = 1 THEN xecudan.id_phuongtien END) AS so_luong_phuongtien
                FROM khachhang LEFT JOIN the ON the.id_khachhang = khachhang.id_khachhang
                LEFT JOIN xecudan ON xecudan.sothe = the.sothe 
                WHERE khachhang.active = 1
                GROUP BY khachhang.id_khachhang;`;
    db.query(sql, function(err, data, fields) {      
        res.render("khachhang_",{list:data});
        // console.log(data);
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
  db.query(`SELECT khachhang.id_khachhang, the.sothe, khachhang.hoten, khachhang.socanho, COUNT(CASE WHEN xecudan.active = 1 THEN xecudan.id_phuongtien END) AS so_luong_phuongtien
              FROM khachhang LEFT JOIN the ON the.id_khachhang = khachhang.id_khachhang 
              LEFT JOIN xecudan ON xecudan.sothe = the.sothe 
              WHERE khachhang.id_khachhang = ?
              GROUP BY khachhang.id_khachhang`, 
              id, function(err, result) {
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
    res.render('khachhang_update', { khachhang: result[0], the: result[0] });
  });
});

router.post('/capnhat-khachhang/', function(req, res, next) {
  // Lấy thông tin mới từ form
  const {id, sothe, hoten, socanho} = req.body
  const newData = {id: id, sothe: sothe, hoten: hoten, socanho: socanho}
console.log(hoten)
  // Cập nhật thông tin khách hàng trong database
  db.query(`UPDATE khachhang SET khachhang.hoten = ?, khachhang.socanho = ? WHERE khachhang.id_khachhang = ?;`, 
            [newData.hoten, newData.socanho, newData.id], function(err, result) {
    if (err) throw err;
    db.query(`UPDATE the set the.id_khachhang = ? WHERE the.sothe = ? ;`, 
              [newData.id, newData.sothe], function(err, result) {
      if (err) throw err;
      // Redirect về trang danh sách khách hàng sau khi cập nhật thành công
      res.send("Cập nhật khách hàng thành công");
    });
  });
});

router.get('/xoa/:id', function(req, res) {
  // var id = req.params.id;
  // res.send('Xóa khách hàng' + id);
  let id_khachhang = req.params.id;
  console.log(id_khachhang)
  let sql= `UPDATE khachhang SET khachhang.active = 0 WHERE id_khachhang = ?`;
  db.query(sql, [id_khachhang], function(err, data) {    
    if (data.affectedRows==0) {
        console.log(`Không có khách hàng ${id} để xóa`); 
    }
    res.redirect('/khachhang');
  })
}); 

router.get('/search', function(req, res, next) {
  const keyword = req.query.keyword;
  const query = `SELECT khachhang.id_khachhang, the.sothe, khachhang.hoten, khachhang.socanho, COUNT(xecudan.id_phuongtien) AS so_luong_phuongtien 
                FROM khachhang LEFT JOIN the 
                ON khachhang.id_khachhang = the.id_khachhang
                LEFT JOIN xecudan 
                ON xecudan.sothe = the.sothe
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