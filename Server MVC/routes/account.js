var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../models/database');


router.get('/', authMiddleware.isClient, (req, res) => {
    const idKhachHang = req.session.user.id_khachhang;

    console.log('id_khachhang from session:', idKhachHang);

    const sql = `
        SELECT khachhang.hoten, taikhoan.tendangnhap, taikhoan.matkhau
        FROM taikhoan LEFT JOIN khachhang 
        ON taikhoan.id_khachhang = khachhang.id_khachhang
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
        res.render('giaodien_khachhang/user_acc', {
            hoTen: customerInfo.hoten,
            userN: customerInfo.tendangnhap,
            passWord: customerInfo.matkhau
        });
    });
});



module.exports = router;