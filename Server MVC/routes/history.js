var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../models/database');
const moment = require('moment');

router.get('/', authMiddleware.isClient, (req, res) => {
    const idKhachHang = req.session.user.id_khachhang;

    console.log('id_khachhang from session:', idKhachHang);

    const sql = `
        SELECT the.sothe, phuongtien.bienso, phuongtien.loaiphuongtien, 
                phuongtien.path_anhbienso, phuongtien.path_anhphuongtien,
                lichsu.thoigianvao, lichsu.thoigianra
        FROM lichsu LEFT JOIN the ON lichsu.id_the = the.id_the
                    LEFT JOIN phuongtien ON lichsu.id_phuongtien = phuongtien.id_phuongtien
                    LEFT JOIN khachhang ON lichsu.id_khachhang = khachhang.id_khachhang
        WHERE khachhang.id_khachhang = ?
    `;

    db.query(sql, [idKhachHang], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi truy xuất thông tin khách hàng");
        }

        // Định dạng thời gian
        results.forEach(his => {
            his.thoigianvao = his.thoigianvao ? moment(his.thoigianvao).format('HH:mm:ss - DD/MM/YYYY') : '';
            his.thoigianra = his.thoigianra ? moment(his.thoigianra).format('HH:mm:ss - DD/MM/YYYY') : '';
        });

        // Log kết quả truy vấn
        console.log('Query results:', results);

        res.render('giaodien_khachhang/history', {
            hoTen: req.session.user.hoten,
            history: results
        });
    });
});

module.exports = router;