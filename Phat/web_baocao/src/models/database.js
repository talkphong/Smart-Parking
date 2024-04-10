const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'baixe',
  });

db.connect(() => console.log('Da ket noi database !'));
module.exports = db;