var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
/* GET home page. */
router.get('/', authMiddleware.isAdmin, function(req, res, next) {
  res.render('index', { title: 'VMU' });
});
module.exports = router;
