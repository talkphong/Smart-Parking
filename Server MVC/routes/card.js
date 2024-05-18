var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../models/database');

router.get('/', authMiddleware.isClient, (req, res) => {
    // Lấy id_khachhang từ session
    const idKhachHang = req.session.user.id_khachhang;

    // Kiểm tra giá trị của id_khachhang
    console.log('id_khachhang from session:', idKhachHang);

    const sql = `
        SELECT khachhang.hoten, sothe, loaithe, ngaytaothe, giatien
        FROM the LEFT JOIN khachhang
        ON the.id_khachhang = khachhang.id_khachhang
        WHERE khachhang.id_khachhang = ?
    `;

    db.query(sql, [idKhachHang], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi truy xuất thông tin khách hàng");
        }

        const customerInfo = results[0];

        // Log kết quả truy vấn
        console.log('Query results:', results);

        if (results.length === 0) {
            return res.render('giaodien_khachhang/user_card', {
                message: "Quý khách chưa đăng ký thẻ nào",
                hoTen: req.session.user.hoten
            });
        }

        // Render template với dữ liệu thông tin khách hàng
        res.render('giaodien_khachhang/user_card', {
            hoTen: customerInfo.hoten,
            soThe: customerInfo.sothe,
            loaiThe: customerInfo.loaithe,
            ngayTaoThe: customerInfo.ngaytaothe,
            giaTien: customerInfo.giatien,
            message: ""
        });
    });
});

module.exports = router;