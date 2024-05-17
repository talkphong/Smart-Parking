var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Đường dẫn tương đối

// Route for client home page
router.get('/', authMiddleware.isClient, function(req, res, next) {
    res.render('giaodien_khachhang/index');
});

module.exports = router;
