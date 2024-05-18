var db = require('../models/database');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  let sql = `SELECT the.id_the, khachhang.hoten, the.sothe, the.loaithe, the.ngaytaothe, the.giatien 
              FROM the LEFT JOIN khachhang 
              ON the.id_khachhang = khachhang.id_khachhang 
              GROUP BY the.id_the`;
  db.query(sql, function (err, data, fields) {
    res.render("the_", { list: data });
    console.log(data);
  });
});

router.get('/form-them-the', function (req, res, next) {
  res.render('the_addnew');
});

router.post('/themthe', function (req, res, next) {
  let id_khachhang = req.body.id_khachhang;
  let sothe = req.body.sothe;
  let loaithe = req.body.loaithe;
  let ngaytaothe = req.body.ngaytaothe;
  let giatien = req.body.giatien;
  let the = {id_khachhang:id_khachhang, sothe:sothe, loaithe:loaithe, ngaytaothe:ngaytaothe, giatien:giatien}
  db.query('INSERT INTO the SET ?', the, function(err, data){
    if (err) throw err;
    res.redirect("/the");
  });
});

router.get('/the_update/:id', function(req, res) {
  //Lay id the tu url
  const id = req.params.id;
  //Truy van
  db.query('SELECT * FROM the WHERE id_the = ?', id, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    // Nếu không tìm thấy nhân viên, trả về trang lỗi 404
    if (result.length === 0) {
      res.status(404).send('Không tìm thấy nhân viên');
      return;
    }
    // Render trang chỉnh sửa với dữ liệu khách hàng
    res.render('the_update', { the: result[0] });
  });
})

router.post('/update_the', function(req, res) {
    // Lấy thông tin mới từ form
  const {id_the, id_khachhang, sothe, loaithe, ngaytaothe, giatien} = req.body
  const newData = {id_the: id_the, id_khachhang: id_khachhang, sothe: sothe, loaithe: loaithe, ngaytaothe: ngaytaothe, giatien: giatien}

    // Cập nhật thông tin thẻ trong database
  db.query(`UPDATE the 
            SET id_khachhang = ?, sothe = ?, loaithe = ?, ngaytaothe = ?, giatien = ?
            WHERE id_the = ?`, [newData.id_khachhang, newData.sothe, newData.loaithe, newData.ngaytaothe, newData.giatien, newData.id_the], function(err, result) {
    if (err) throw err;
    // Redirect về trang danh sách nhân viên sau khi cập nhật thành công
    res.send("Cập nhật thẻ thành công");
  });
})

router.get('/the_delete/:id', function(req, res) {
    let id_nhanvien = req.params.id;
    console.log(id_nhanvien)
    let sql= "DELETE FROM `the` WHERE id_the = ?;";
    db.query(sql, [id_nhanvien], function(err, data) {    
      if (data.affectedRows==0) {
          console.log(`Không có thẻ ${id} để xóa`); 
      }
      res.redirect('/the');
    })
  }); 

  
router.get('/search/', function(req, res, next) {
  const keyword = req.query.keyword;
  const query = `SELECT the.id_the, khachhang.hoten, the.sothe, the.loaithe, the.ngaytaothe, the.giatien 
                FROM the LEFT JOIN khachhang 
                ON the.id_khachhang = khachhang.id_khachhang 
                GROUP BY the.id_the
                HAVING id_the LIKE ? OR hoten LIKE ? OR loaithe LIKE ? OR giatien LIKE ?`;
  const searchTerm = `%${keyword}%`; // Thêm dấu % cho tìm kiếm mở rộng
  db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
        res.json(result); // Send search results back as JSON
    }
  });
});

module.exports = router;
