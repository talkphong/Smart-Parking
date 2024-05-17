var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
  // Xóa đối tượng session của người dùng
  req.session.destroy((err) => {
      if (err) {
          console.error('Lỗi khi đăng xuất:', err);
          res.status(500).send('Lỗi khi đăng xuất');
      } else {
          // Nếu không có lỗi, chuyển hướng người dùng đến trang đăng nhập
          res.redirect('/dangnhap');
      }
  });
});

module.exports = router;