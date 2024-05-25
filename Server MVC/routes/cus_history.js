var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../models/database');
const moment = require('moment');

router.get('/', authMiddleware.isClient, (req, res) => {
    const idKhachHang = req.session.user.id_khachhang;

    console.log('id_khachhang from session:', idKhachHang);

    const sql = `SELECT lichsu.sothe, cong.tencong as cong, xecudan.loaiphuongtien, xecudan.bienso, 
                 lichsu.thoigianmo, lichsu.path_anhbienso, lichsu.path_anhphuongtien
                 FROM lichsu 
                 JOIN xecudan ON lichsu.bienso = xecudan.bienso
                 JOIN cong ON lichsu.id_cong = cong.id_cong
                 WHERE lichsu.id_khachhang = ?`;
    
    db.query(sql, [idKhachHang], (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).send('Internal Server Error');
        }

        // Format the time to the desired format
        results.forEach(result => {
            result.thoigianmo = moment(result.thoigianmo).format('DD-MM-YYYY, HH:mm');
        });

        res.render('giaodien_khachhang/history', { 
            hoTen: req.session.user.hoten,
            history: results 
        });
    });
});

router.get('/search', authMiddleware.isClient, function(req, res, next) {
    const idKhachHang = req.session.user.id_khachhang;
    const keyword = req.query.keyword || '';
    console.log('Search keyword:', keyword);

    const query = `SELECT lichsu.sothe, cong.tencong as cong, xecudan.loaiphuongtien, xecudan.bienso, 
                   lichsu.thoigianmo, lichsu.path_anhbienso, lichsu.path_anhphuongtien
                   FROM lichsu 
                   JOIN xecudan ON lichsu.bienso = xecudan.bienso
                   JOIN cong ON lichsu.id_cong = cong.id_cong
                   WHERE lichsu.id_khachhang = ? AND (cong.tencong LIKE ? OR lichsu.bienso LIKE ? 
                   OR xecudan.loaiphuongtien LIKE ? OR lichsu.thoigianmo LIKE ? OR lichsu.sothe LIKE ?)`;

    const searchTerm = `%${keyword}%`; // Thêm dấu % cho tìm kiếm mở rộng

    db.query(query, [idKhachHang, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], function(err, results) {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).send('Internal Server Error');
        }

        // Format the time to the desired format
        results.forEach(result => {
            result.thoigianmo = moment(result.thoigianmo).format('DD-MM-YYYY, HH:mm');
        });

        res.render('giaodien_khachhang/history', { 
            hoTen: req.session.user.hoten,
            history: results
        });
    });
});

module.exports = router;
