var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Đường dẫn tương đối
const db = require('../models/database');

// Route for client home page
router.get('/', authMiddleware.isClient, function(req, res, next) {
    const idKhachHang = req.session.user.id_khachhang;

    console.log('id_khachhang from session:', idKhachHang);

    const sql = `
        SELECT hoten 
        FROM khachhang
        WHERE id_khachhang = ?
    `;

    db.query(sql, [idKhachHang], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi truy xuất thông tin khách hàng");
        }

        console.log('Query results:', results);

        if (results.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông tin khách hàng" });
        }

        const customerInfo = results[0];

        res.render('giaodien_khachhang/index', {
            hoTen: customerInfo.hoten
        });
    });
});

module.exports = router;
