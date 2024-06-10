var db = require('../models/database');

// callback(isValid?, loaithe, bienso, id_khachhang, isInside?, bsvanglai)
function checkSothe(sothe, callback) {
    const sql = `SELECT the.sothe, the.loaithe, xecudan.bienso, khachhang.id_khachhang, xecudan.inside, xevanglai.bienso as bsvanglai
                FROM the LEFT JOIN xecudan ON xecudan.sothe = the.sothe 
                LEFT JOIN khachhang ON the.id_khachhang = khachhang.id_khachhang
                LEFT JOIN xevanglai ON xevanglai.sothe = the.sothe
                WHERE the.sothe = '${sothe}' AND (the.active = '1' OR xevanglai.active = '1' OR xecudan.active = '1');`
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            callback(err,null, null, null, null, null, null)
        }
        //Nếu k tìm đc bản ghi nào -> k có thẻ này trong db -> thẻ k hợp lệ (isValid = false) -> các giá trị còn lại null
        if (results.length == 0) {callback(err, false, null, null, null, null, null)} 

        //Nếu tìm đc bản ghi -> trả về các giá trị: loaithe, bienso (mảng gồm nhiều biển số), tenKH
        else {
            callback(err, 
                    true,                                               //isValid
                    results[0][Object.keys(results[0])[1]],             //loaithe
                    results.map(row => row[Object.keys(results[0])[2]]),//bienso (mảng)
                    results[0][Object.keys(results[0])[3]],             //id_khachhang
                    results.map(row => row[Object.keys(results[0])[4]]),//isInside?
                    results[0][Object.keys(results[0])[5]],)             //bsvanglai
        } 
    })
}

function insert_xevanglai(sothe, bienso, inside, path_anhphuongtien, path_anhbienso){
    const xevanglai = {sothe: sothe, bienso: bienso, inside: inside, path_anhphuongtien: path_anhphuongtien, path_anhbienso: path_anhbienso}
    db.query('INSERT INTO xevanglai SET ?', xevanglai, function(err, data){
        if (err) {console.error(err)}
        else {console.log("Thêm xe vãng lai thành công!")}
    })
}

function delete_xevanglai(bienso){
    db.query(`UPDATE xevanglai SET sothe= NULL, inside='0',active='0' WHERE bienso = '${bienso}' `, function(err, data){
        if (err) {console.error(err)}
        else {console.log("xóa xe vãng lai thành công!")}
    })
}

function saveLichsu(id_cong, sothe, bienso, id_khachhang, id_nhanvien, thoigianmo, path_anhphuongtien, path_anhbienso){
    const lichsu = {id_cong: id_cong, sothe: sothe, bienso: bienso, id_khachhang: id_khachhang, id_nhanvien: id_nhanvien, thoigianmo: thoigianmo, path_anhphuongtien: path_anhphuongtien, path_anhbienso: path_anhbienso};
    db.query('INSERT INTO lichsu SET ?', lichsu, function(err, data){
        if (err) {console.error(err)}
        else {console.log("Thêm lịch sử thành công!")}
        
    })
}
module.exports.checkSothe = checkSothe
module.exports.saveLichsu = saveLichsu
module.exports.insert_xevanglai = insert_xevanglai
module.exports.delete_xevanglai = delete_xevanglai
