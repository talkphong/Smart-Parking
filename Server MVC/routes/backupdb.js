const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const backupModel = require('../models/backupdb');

// Route để hiển thị trang backup
router.get('/', authMiddleware.isAdmin, (req, res) => {
    res.render('backupdb');
});

// Route để xử lý yêu cầu backup từ form
router.post('/backup-db', (req, res) => {
    const { host, user, password, database } = req.body;
    backupModel.backupDatabase(host, user, password, database, (error, result) => {
        if (error) {
            res.render('backupdb', { message: { type: 'error', text: `Sao lưu thất bại: ${error.message}` } });
        } else {
            res.render('backupdb', { message: { type: 'success', text: 'Sao lưu cơ sở dữ liệu thành công!' } });
        }
    });
});

module.exports = router;
