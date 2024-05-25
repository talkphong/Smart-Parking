var db = require('../models/database');
var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const moment = require('moment');

router.get('/', authMiddleware.isAdmin, function (req, res, next) {
    let sql = `SELECT id_nhanvien, hoten, ngayvaolam 
                FROM nhanvien 
                WHERE nhanvien.active = 1
                GROUP BY id_nhanvien`;
    db.query(sql, function (err, data, fields) {
        res.render("nhanvien_", { list: data });
        console.log(data);
    });
});

router.get('/form-them-nhanvien', function (req, res, next) {
    res.render('nhanvien_addnew');
});

router.post('/themnhanvien', function (req, res, next) {
    let hoten = req.body.hoten;
    let ngayvaolam = req.body.ngayvaolam;
    let nhanvien = {hoten: hoten, ngayvaolam: ngayvaolam }
    db.query(`INSERT INTO nhanvien SET ?`, nhanvien, function (err, data) {
        if (err) throw err;
        res.redirect("/nhanvien");
    });
});

router.get('/nhanvien_update/:id', function(req, res) {
  //Lay id nhan vien tu url
  const id = req.params.id;
  //Truy van
  db.query('SELECT * FROM nhanvien WHERE id_nhanvien = ?', id, function(err, result) {
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

    // Chuyển đổi ngày vào làm về định dạng 'DD-MM-YYYY' và múi giờ của bạn
    let nhanvien = result[0];
    nhanvien.ngayvaolam= moment(nhanvien.ngayvaolam).format('DD-MM-YYYY');

    // Render trang chỉnh sửa với dữ liệu khách hàng
    res.render('nhanvien_update', { nhanvien: nhanvien, moment: moment });
  });
})

router.post('/update_nhanvien', function(req, res) {
    // Lấy thông tin mới từ form
  const {id_nhanvien, hoten, ngayVaoLamNewFormat} = req.body;
  const ngayvaolamISO = moment(ngayVaoLamNewFormat, 'DD/MM/YYYY').toISOString();
  const newData = {id_nhanvien: id_nhanvien, hoten: hoten, ngayvaolam: ngayvaolamISO};

    // Cập nhật thông tin nhân viên trong database
  db.query(`UPDATE nhanvien 
            SET hoten = ?, ngayvaolam = ?
            WHERE id_nhanvien = ?`, [newData.hoten, newData.ngayvaolam, newData.id_nhanvien], function(err, result) {
    if (err) throw err;
    // Redirect về trang danh sách nhân viên sau khi cập nhật thành công
    res.send("Cập nhật khách hàng thành công");
  });
})

router.get('/nhanvien_delete/:id', function(req, res) {
    let id_nhanvien = req.params.id;
    console.log(id_nhanvien)
    let sql= "UPDATE nhanvien SET nhanvien.active = 0 WHERE nhanvien.id_nhanvien = ?;";
    db.query(sql, [id_nhanvien], function(err, data) {    
      if (data.affectedRows==0) {
          console.log(`Không có nhân viên ${id} để xóa`); 
      }
      res.redirect('/nhanvien');
    })
  }); 

  
router.get('/search/', function(req, res, next) {
  const keyword = req.query.keyword;
  const query = `SELECT id_nhanvien, hoten, ngayvaolam
                FROM nhanvien 
                WHERE id_nhanvien LIKE ? OR hoten LIKE ? OR ngayvaolam LIKE ?`;
  const searchTerm = `%${keyword}%`; // Thêm dấu % cho tìm kiếm mở rộng
  db.query(query, [searchTerm, searchTerm, searchTerm], function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
        res.json(result); // Send search results back as JSON
    }
  });
});

module.exports = router;