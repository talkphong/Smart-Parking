var db = require('../models/database');
var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.isAdmin, function (req, res, next) {
  let sql = `SELECT xecudan.id_phuongtien, khachhang.hoten, 
              xecudan.bienso, xecudan.loaiphuongtien, 
              xecudan.path_anhphuongtien, 
              xecudan.path_anhbienso
              FROM xecudan LEFT JOIN the 
              ON xecudan.sothe = the.sothe JOIN khachhang on the.id_khachhang = khachhang.id_khachhang
              WHERE xecudan.active = 1`;
  db.query(sql, function (err, data, fields) {
      res.render("phuongtien_", { list: data });
      console.log(data);
  });
});

router.get('/form-them-phuongtien', function (req, res, next) {
    res.render('phuongtien_addnew');
});

router.post('/themphuongtien', function (req, res, next) {
    const {sothe, bienso, loaiphuongtien, anhphuongtien, anhbienso} = req.body;
    const phuongtien = {sothe: sothe, bienso: bienso, loaiphuongtien: loaiphuongtien, path_anhphuongtien: anhphuongtien, path_anhbienso: anhbienso}
    console.log(phuongtien)
    db.query(`INSERT INTO xecudan SET ?`, phuongtien, function (err, data) {
        if (err) throw err;
        res.redirect("/phuongtien");
    });
});

router.get('/phuongtien_update/:id', function(req, res) {
    //Lay id phuong tien tu url
    const id = req.params.id;
    //Truy van
    db.query('SELECT * FROM xecudan WHERE id_phuongtien = ?', id, function(err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      // Nếu không tìm thấy phương tiện, trả về trang lỗi 404
      if (result.length === 0) {
        res.status(404).send('Không tìm thấy phương tiện');
        return;
      }
      // Render trang chỉnh sửa với dữ liệu khách hàng
      res.render('phuongtien_update', { phuongtien: result[0] });
    });
  })
  
  router.post('/update_phuongtien', function(req, res) {
    // Lấy thông tin mới từ form
    const {id_phuongtien, sothe, bienso, loaiphuongtien, anhphuongtien, anhbienso} = req.body
    const newData = {id_phuongtien: id_phuongtien, sothe : sothe, bienso : bienso, loaiphuongtien : loaiphuongtien, path_anhphuongtien : anhphuongtien, path_anhbienso : anhbienso} 
  
    // Cập nhật thông tin phương tiện trong database
    db.query(`UPDATE xecudan 
              SET sothe = ?, bienso = ?, loaiphuongtien = ?, path_anhphuongtien = ?, path_anhbienso = ?
              WHERE id_phuongtien = ?`, [newData.sothe, newData.bienso, newData.loaiphuongtien, newData.path_anhphuongtien, newData.path_anhbienso, newData.id_phuongtien], function(err, result) {
      if (err) throw err;
      // Redirect về trang danh sách phương tiện sau khi cập nhật thành công
      res.send("Cập nhật khách hàng thành công");
    });
  })
  
  router.get('/phuongtien_delete/:id', function(req, res) {
      let id_phuongtien = req.params.id;
      console.log(id_phuongtien)
      let sql= "UPDATE xecudan SET xecudan.active = 0  WHERE id_phuongtien = ?;";
      db.query(sql, [id_phuongtien], function(err, data) {    
        if (data.affectedRows==0) {
            console.log(`Không có phương tiện ${id} để xóa`); 
        }
        res.redirect('/phuongtien');
      })
    }); 
  
    
router.get('/search/', function(req, res, next) {
const keyword = req.query.keyword;
console.log(keyword)
const query = `SELECT xecudan.id_phuongtien, khachhang.hoten, 
                xecudan.bienso, xecudan.loaiphuongtien, 
                xecudan.path_anhphuongtien, 
                xecudan.path_anhbienso
                FROM xecudan LEFT JOIN the 
                ON xecudan.sothe = the.sothe JOIN khachhang on the.id_khachhang = khachhang.id_khachhang
                WHERE xecudan.active = 1 
                HAVING id_phuongtien LIKE ? OR hoten LIKE ? OR bienso LIKE ? OR loaiphuongtien LIKE ?`;
const searchTerm = `%${keyword}%`; // Thêm dấu % cho tìm kiếm mở rộng
db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], function(err, result) {
    if (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
    } else {
        res.json(result); // Send search results back as JSON
        console.log(result)
    }
});
});

module.exports = router;