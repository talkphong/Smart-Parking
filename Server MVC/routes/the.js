var db = require('../models/database');
var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const moment = require('moment');

router.get('/', authMiddleware.isAdmin, function (req, res, next) {
  let sql = `SELECT the.sothe, the.loaithe, khachhang.hoten, the.ngaytaothe
              FROM the LEFT JOIN khachhang 
              ON the.id_khachhang = khachhang.id_khachhang 
              WHERE the.active = 1`;
  db.query(sql, function (err, data, fields) {
    res.render("the_", { list: data });
    console.log(data);
  });
});

router.get('/form-them-the', function (req, res, next) {
  res.render('the_addnew');
});

router.post('/themthe', function (req, res, next) {
  const {sothe, loaithe, ngaytaothe} = req.body
  let the = {sothe:sothe, loaithe:loaithe, ngaytaothe:ngaytaothe}
  db.query('INSERT INTO the SET ?', the, function(err, data){
    if (err) throw err;
    res.redirect("/the");
  });
});

router.get('/the_update/:id', function(req, res) {
  //Lay id the tu url
  let id = req.params.id;
  console.log(id)
  //Truy van
  db.query('SELECT * FROM the WHERE sothe = ?', id, function(err, result) {
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
    let the = result[0];
    // Chuyển đổi ngày tạo thẻ về định dạng 'DD/MM/YYYY' cho hiển thị
    the.ngaytaothe = moment(the.ngaytaothe).format('DD/MM/YYYY');
    // Render trang chỉnh sửa với dữ liệu khách hàng
    res.render('the_update', { the: the, moment: moment });
  });
})

router.post('/update_the', function(req, res) {
  // Lấy thông tin mới từ form
  const {sothe, loaithe, ngaytaothe} = req.body
  // Chuyển đổi 'ngaytaothe' từ định dạng 'DD/MM/YYYY' về định dạng 'YYYY-MM-DD'
  const ngaytaotheFormatted = moment(ngaytaothe, 'DD/MM/YYYY').format('YYYY-MM-DD');
  const newData = {sothe: sothe, loaithe: loaithe, ngaytaothe: ngaytaotheFormatted}

    // Cập nhật thông tin thẻ trong database
  db.query(`UPDATE the 
            SET loaithe = ?, ngaytaothe = ?
            WHERE sothe = ?`, [newData.loaithe, newData.ngaytaothe, newData.sothe], function(err, result) {
    if (err) throw err;
    // Redirect về trang danh sách nhân viên sau khi cập nhật thành công
    res.send("Cập nhật thẻ thành công");
  });
})

router.get('/the_delete/:id', function(req, res) {
    let sothe = req.params.id;
    console.log(sothe)
    let sql= "UPDATE the SET the.active = 0, id_khachhang = NULL WHERE sothe = ?;";
    db.query(sql, sothe, function(err, data) {    
      if (data.affectedRows==0) {
          console.log(`Không có thẻ ${sothe} để xóa`); 
      }
      db.query("UPDATE xecudan SET active = 0 WHERE sothe = ?;", sothe, function(err, data) {})
      res.redirect('/the');
    })
  }); 

  
router.get('/search/', function(req, res, next) {
  const keyword = req.query.keyword;
  const query = `SELECT the.sothe, the.loaithe, khachhang.hoten, the.ngaytaothe
                FROM the LEFT JOIN khachhang 
                ON the.id_khachhang = khachhang.id_khachhang 
                WHERE the.active = 1
                HAVING sothe LIKE ? OR hoten LIKE ? OR loaithe LIKE ? OR ngaytaothe LIKE?`;
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
