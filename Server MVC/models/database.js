//Database trả về kết nối với cơ sở dữ liệu


const mysql = require("mysql");
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "baixe",
}); 
db.connect(() => console.log('Đã kết nối cơ sở dữ liệu!'));


module.exports = db; 
