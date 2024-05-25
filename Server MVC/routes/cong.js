const { isAdmin } = require('../middleware/authMiddleware');
var db = require('../models/database');
const authMiddleware = require('../middleware/authMiddleware');

var express = require('express');
var router = express.Router();

router.get('/', authMiddleware.isAdmin, function(req, res, next) {
    // res.send('Danh sách khách hàng');  
    let sql = `
        SELECT * FROM cong
    `;
    db.query(sql, function(err, data, fields) {      
        res.render("cong_",{ list:data });
        // console.log(data);
    }); 
});

router.get('/search', function(req, res, next) {
    const keyword = req.query.keyword;
    const query = `
        SELECT * FROM cong
        WHERE id_cong LIKE ?
        OR tencong LIKE ?
    `;
    const searchTerm = `%${keyword}%`;
    db.query(query, [searchTerm, searchTerm], function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
              res.json(result); // Send search results back as JSON
        }
    });
});

module.exports = router;