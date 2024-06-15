const express = require('express');
const router = express.Router();
const restoreModel = require('../models/restoredb');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.isAdmin, (req, res) => {
    const backupDir = path.join(__dirname, '../bin/db-backup');

    fs.readdir(backupDir, (err, files) => {
        if (err) {
            res.render('restoredb', { message: { type: 'error', text: `Không thể liệt kê các tệp sao lưu: ${err.message}` }, backups: [] });
            return;
        }

        const backups = files.filter(file => file.endsWith('.sql'));
        res.render('restoredb', { message: null, backups: backups });
    });
});

router.post('/restore-db', (req, res) => {
    const { backupFile } = req.body; // Chỉ cần backupFile
    const user = 'root'; // User MySQL của bạn, có thể cấu hình hoặc yêu cầu từ người dùng
    const password = ''; // Password MySQL của bạn, có thể cấu hình hoặc yêu cầu từ người dùng
    const database = 'baixe'; // Tên database, có thể cấu hình hoặc yêu cầu từ người dùng

    restoreModel.restoreDatabase(user, password, database, backupFile, (error, result) => {
        if (error) {
            res.render('restoredb', { message: { type: 'error', text: `Khôi phục thất bại: ${error.message}` }, backups: [] });
        } else {
            res.render('restoredb', { message: { type: 'success', text: 'Khôi phục cơ sở dữ liệu thành công!' }, backups: [] });
        }
    });
});

module.exports = router;
