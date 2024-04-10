var db = require('../models/database');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    // res.send('Danh sách khách hàng');  
    let sql = `SELECT * FROM khachhang`;
    db.query(sql, function(err, data,  fields) {      
        res.render("khachhang_list",{list:data});
        console.log(data);
    }); 
});
router.get('/addnew', function(req, res, next) {
    // res.send('Form thêm khách hàng'); 
    res.render("khachhang_addnew");
});
router.post('/store', function(req, res, next) {
    //nhận dữ liệu từ addnew để thêm record vào db
    let hoten = req.body.hoten;
    let socanho = req.body.socanho;
    let khachhang = {hoten:hoten, socanho:socanho}
    db.query('insert into khachhang SET ?', khachhang, function(err, data) {
        if (err) throw err;
        res.redirect("/khachhang/");
    });
});
router.get('/edit/:id', function(req, res, next) {
//   var id = req.params.id;
//   res.send('Form sửa khách hàng' + id);
  let id = req.params.id;   
  let sql = `SELECT id_khachhang, hoten, socanho FROM khachhang where id_khachhang=${id}`;
  db.query(sql, function(err, data) {    
    res.render("khachhang_edit", { khachhang:data[0]});    
  });
});
router.post('/update', function(req, res, next) {
    //nhận dữ liệu từ edit để cập nhật vào db
  let id_khachhang = req.body.id_khachhang;     
  let hoten = req.body.hoten;
  let socanho = req.body.socanho;
  db.query(`UPDATE khachhang SET hoten=?, socanho=? WHERE id_khachhang = ?`,  [hoten, socanho, id_khachhang], 
     function(err, data) {    
      if (data.affectedRows==0) {
         console.log(`Không có id khách ${id} để cập nhật`);
      }
      res.redirect("/khachhang/");
 })
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

module.exports = router;