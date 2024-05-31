var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../models/database');
const moment = require('moment');

router.get('/', authMiddleware.isClient, (req, res) => {
    const idKhachHang = req.session.user.id_khachhang;

    console.log('id_khachhang from session:', idKhachHang);

    const sql = `SELECT cong.tencong, xecudan.loaiphuongtien, xecudan.bienso, lichsu.thoigianmo
                FROM lichsu JOIN xecudan ON lichsu.bienso = xecudan.bienso
                JOIN cong ON lichsu.id_cong = cong.id_cong
                WHERE lichsu.id_khachhang = ? AND cong.tencong LIKE ?`;

    db.query(sql, [idKhachHang, '%vào%'], (err, historyIN) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi truy xuất thông tin khách hàng");
        }
        
        // Định dạng thời gian
        historyIN.forEach(his => {
            his.thoigianmo = his.thoigianmo ? moment(his.thoigianmo).format('HH:mm:ss - DD/MM/YYYY') : '';
        });

        // Log kết quả truy vấn
        // console.log('Query results:', historyIN);

        db.query(sql, [idKhachHang, '%ra%'], (err, historyOUT) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi khi truy xuất thông tin khách hàng");
            }
            
            // Định dạng thời gian
            historyOUT.forEach(his => {
                his.thoigianmo = his.thoigianmo ? moment(his.thoigianmo).format('HH:mm:ss - DD/MM/YYYY') : '';
            });
    
            // Log kết quả truy vấn
            // console.log('Query results:', historyIN);
    
            res.render('giaodien_khachhang/history', {
                hoTen: req.session.user.hoten,
                historyIN: historyIN,
                historyOUT: historyOUT
            });
        });
    });
});

router.get('/search/', function(req, res, next) {
    const idKhachHang = req.session.user.id_khachhang;
    const keyword = req.query.keyword;
    console.log(keyword)
    const query = `SELECT cong.tencong, xecudan.loaiphuongtien, xecudan.bienso, lichsu.thoigianmo
                    FROM lichsu JOIN xecudan ON lichsu.bienso = xecudan.bienso
                    JOIN cong ON lichsu.id_cong = cong.id_cong
                    WHERE lichsu.id_khachhang = ? AND cong.tencong LIKE ? 
                        AND (lichsu.bienso LIKE ? OR xecudan.loaiphuongtien LIKE ? OR lichsu.thoigianmo LIKE ?)`;
    const searchTerm = `%${keyword}%`; // Thêm dấu % cho tìm kiếm mở rộng
    db.query(query, [idKhachHang, '%vào%', searchTerm, searchTerm, searchTerm], function(err, historyIN) {
        historyIN.forEach(his => {
            his.thoigianmo = his.thoigianmo ? moment(his.thoigianmo).format('HH:mm:ss - DD/MM/YYYY') : '';
        });

        db.query(query, [idKhachHang, '%ra%', searchTerm, searchTerm, searchTerm], function(err, historyOUT) {
            historyOUT.forEach(his => {
                his.thoigianmo = his.thoigianmo ? moment(his.thoigianmo).format('HH:mm:ss - DD/MM/YYYY') : '';
            });

            // res.render('giaodien_khachhang/history', {
            //     hoTen: req.session.user.hoten,
            //     historyIN: historyIN,
            //     historyOUT: historyOUT
            // });
            res.json({ historyIN: historyIN, historyOUT: historyOUT });
          });
    });
  });

module.exports = router;