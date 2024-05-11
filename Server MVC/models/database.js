//Database trả về kết nối với cơ sở dữ liệu
const mysql = require("mysql");
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    // database: "baixe",
    database: "smart_parking",
}); 
db.connect(() => console.log('Da ket noi database !'));
module.exports = db; 