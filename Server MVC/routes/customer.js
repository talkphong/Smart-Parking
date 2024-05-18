const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../models/database'); // Kết nối cơ sở dữ liệu

// Route hiển thị thông tin khách hàng trên card header
router.get('/', authMiddleware.isClient, (req, res) => {
    // Lấy id_khachhang từ session
    const idKhachHang = req.session.user.id_khachhang;

    // Kiểm tra giá trị của id_khachhang
    console.log('id_khachhang from session:', idKhachHang);

    // Query để lấy thông tin khách hàng từ cơ sở dữ liệu
    const sql = `
        SELECT khachhang.hoten, khachhang.socanho
        FROM khachhang 
        WHERE khachhang.id_khachhang = ?
    `;

    db.query(sql, [idKhachHang], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi truy xuất thông tin khách hàng");
        }

        // Log kết quả truy vấn
        console.log('Query results:', results);

        if (results.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông tin khách hàng" });
        }

        const customerInfo = results[0];

        // Render template với dữ liệu thông tin khách hàng
        res.render('giaodien_khachhang/cus_info', {
            fullName: customerInfo.hoten,
            apartmentNumber: customerInfo.socanho
        });
    });
});

module.exports = router;
