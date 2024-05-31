const modelCamera = require('../models/camera')
var db = require('../models/database');
var express = require('express');
// var router = express.Router();
const moment = require('moment-timezone');

const path = require('path')

const fs = require('fs');
const axios = require('axios');
const { Blob } = require('buffer');
const multer  = require('multer');
const sharp = require('sharp');

const app = express()

let command = ""

const path_anhlichsu = path.join(__dirname, "../public/images/anhlichsu")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path_anhlichsu)
  },
  filename: function (req, file, cb) {
    cb(null, moment().tz('Asia/Ho_Chi_Minh').format('YYYY-DD-MM HH mm ss') + '_full' + '.jpg')
    // cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

async function cropImage(inputPath, outputPath, xmin, ymin, xmax, ymax) {
    const inputBuffer = fs.readFileSync(inputPath);
    await sharp(inputBuffer)
        .extract({ left: xmin, top: ymin, width: xmax-xmin, height: ymax-ymin })
        .toFile(outputPath);
}


const authMiddleware = require('../middleware/authMiddleware');


// app.get('/', async function (req, res, next) {
  app.get('/', authMiddleware.isStaff, function (req, res, next) {
    res.render('camera');
    // modelCamera.checkSothe('A1 68 11', (err, isValid, loaithe, bienso, tenKH) => {
    //   console.log("isValid: " + isValid)
    //   console.log("loaithe: " + loaithe)
    //   console.log("bienso: " + bienso)
    //   console.log("tenKH: " + tenKH)
    //   if (bienso.includes('15B311111')){console.log('yes')} else {console.log('no')}
    // })

});

const urlToAPI = "http://127.0.0.1:8000/process_image"
app.post('/upload', upload.single('image'), async (req, res) => {
  const id_nhanvien = req.session.user.id_nhanvien;

  let now = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
  img_crop_path = 'public\\images\\anhlichsu\\' + moment(now).format('YYYY-MM-DD HH mm ss') + '_crop' +'.jpg'

  // // lấy port và sothe (cùng ảnh full) từ web camera
  const {port, sothe} = req.body
  console.log("port: %s \nUID: %s ", port, sothe)

  // Đường dẫn tới ảnh full
  const img_full_path = 'public\\images\\anhlichsu\\' + req.file.filename;
  console.log("Đã lưu ảnh tại: " + img_full_path) 

  // Chuyển đổi kiểu dữ liệu của ảnh để nhận diện = AI
  const imgBufferData = fs.readFileSync(img_full_path)
  const imgBlobData = new Blob([imgBufferData]);
  const formData = new FormData()
  formData.append('image', imgBlobData, 'image.jpg');
  const result = await axios.post(urlToAPI, formData)

  // Thông tin nhận được sau khi nhận diện: [tọa độ biển, biển số]
  console.log('from API: ' + result.data)

  let img_crop =""
  let LpNumber =""
  // Nếu tìm được tọa độ biển -> cắt biển số và lưu vào anhlichsu
  if (result.data[0] != -1){
    const inputPath = img_full_path
    const outputPath = img_crop_path
    const xmin = result.data[0][0]
    const xmax = result.data[0][1]
    const ymin = result.data[0][2]
    const ymax = result.data[0][3]
    await cropImage(inputPath, outputPath, xmin, xmax, ymin, ymax)
    img_crop = fs.readFileSync(img_crop_path)
    // Nếu nhận diện đủ 8 chữ số trên biển
      if(result.data[1] != -1){
        LpNumber = result.data[1]
        if (port == "I") {check_lichsuIN(sothe, LpNumber, id_nhanvien, now, img_full_path, img_crop_path)}
        else if (port == "O") {check_lichsuOUT(sothe, LpNumber, id_nhanvien, now, img_full_path, img_crop_path)}
      }else{
          LpNumber = "Không nhận diện đủ 8 chữ số"
          console.log("Không nhận diện đủ 8 chữ số")
      }
  }else{
    LpNumber = "Không tìm thấy biển số"
    console.log("Không tìm thấy biển số")
  }
  
  // gửi ảnh đã cắt và chuỗi biển số xe cho web
  const dataToSend = {
    img_crop: img_crop.toString('base64'),  
    LpNumber: LpNumber 
  };
  res.json(dataToSend);


  // fs.unlink(`${pathToUploads}/output.jpg`, (err) => {});
  // fs.unlink(`${pathToUploads}/image.jpg`, (err) => {});
  
})

function check_lichsuIN (sothe, LpNumber, id_nhanvien, now, img_full_path, img_crop_path){
  lichsuIN.id_cong = '1'
  lichsuIN.sothe = sothe
  lichsuIN.bienso = LpNumber
  lichsuIN.id_nhanvien = id_nhanvien
  lichsuIN.thoigianmo = now
  lichsuIN.path_anhphuongtien = img_full_path
  lichsuIN.path_anhbienso = img_crop_path

  modelCamera.checkSothe(lichsuIN.sothe, (err, isValid, loaithe, bienso, id_khachhang, isInside) => {
    console.log('isValid:'+isValid)
    console.log('loaithe:'+loaithe)
    console.log('bienso:'+bienso)
    console.log('id_khachhang:'+id_khachhang)
    console.log('isInside:'+isInside)
    // console.log('indexbienso:'+bienso.indexOf(lichsuIN.bienso))
    // console.log('inside:'+isInside[bienso.indexOf(lichsuIN.bienso)])

    if (!isValid) {console.error("Thẻ xe không hợp lệ (không có trong db)"); return}
    if (loaithe == 'Thẻ vãng lai') {
      console.log('Đây là thẻ vãng lai')
      console.log(lichsuIN)
      modelCamera.insert_xevanglai(lichsuIN.sothe, lichsuIN.bienso, '1', lichsuIN.path_anhphuongtien, lichsuIN.path_anhbienso)
      ws.send("OpenIn")
      return
    }
    if (loaithe == 'Thẻ cư dân') {
      if (bienso.includes(lichsuIN.bienso)) {
        if (!isInside[bienso.indexOf(lichsuIN.bienso)]) {
          console.log("Đây là thẻ cư dân, đủ điều kiện, mở cổng"); 
          lichsuIN.id_khachhang = id_khachhang; 
          ws.send("OpenIn")
          return
        }
        else {console.log(`Xe ${lichsuIN.bienso} đang ở trong bãi, không thể vào tiếp`)}
      }
      else {console.error(`Biển số xe ${lichsuIN.bienso} chưa được đăng ký`)}
    }
    // console.log(lichsuIN)
    lichsuIN.clear();
  })
}


function check_lichsuOUT (sothe, LpNumber, id_nhanvien, now, img_full_path, img_crop_path){
  lichsuOUT.id_cong = '2'
  lichsuOUT.sothe = sothe
  lichsuOUT.bienso = LpNumber
  lichsuOUT.id_nhanvien = id_nhanvien
  lichsuOUT.thoigianmo = now
  lichsuOUT.path_anhphuongtien = img_full_path
  lichsuOUT.path_anhbienso = img_crop_path
  console.log(lichsuOUT)
  modelCamera.checkSothe(lichsuOUT.sothe, (err, isValid, loaithe, bienso, id_khachhang, isInside) => {
    console.log('isValid:'+isValid)
    console.log('loaithe:'+loaithe)
    console.log('bienso:'+bienso)
    console.log('id_khachhang:'+id_khachhang)
    console.log('isInside:'+isInside)
    // console.log('indexbienso:'+bienso.indexOf(lichsuIN.bienso))
    // console.log('inside:'+isInside[bienso.indexOf(lichsuIN.bienso)])

    if (!isValid) {console.error(`Thẻ xe ${lichsuOUT.sothe} không hợp lệ (không có trong db)`); return}
    if (loaithe == 'Thẻ vãng lai') {
      console.log('Đây là thẻ vãng lai')
      if (lichsuOUT.bienso == bienso){
        if (isInside) {
          console.log("Đủ điều kiện, mở cổng"); 
          ws.send("OpenOut")
          return
        }
        else {console.log(`Xe ${lichsuOUT.bienso} đang ở ngoài bãi, không thể ra tiếp`)}
      } 
    }
    if (loaithe == 'Thẻ cư dân') {
      if (bienso.includes(lichsuOUT.bienso)) {
        if (isInside[bienso.indexOf(lichsuOUT.bienso)]) {
          console.log("Đây là thẻ cư dân, đủ điều kiện, mở cổng"); 
          lichsuOUT.id_khachhang = id_khachhang; 
          ws.send("OpenOut")
          return
        }
        else {console.log(`Xe ${lichsuOUT.bienso} đang ở ngoài bãi, không thể ra tiếp`)}
      }
      else {console.error(`Biển số xe ${lichsuOUT.bienso} chưa được đăng ký`)}
    }
    // console.log(lichsuIN)
    lichsuOUT.clear();
  })
}


const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:3000');
ws.on('open', function open() {
});
// Khi có 1 chuỗi message được gửi đến
ws.on('message', function incoming(message) { 
  // In chuỗi đó ra console
  console.log('camera.js receive: %s', message); 

  // Phân tích chuỗi nhận được thành 2 phần: port và data
  const str = String.fromCharCode(...message);
  const port = str[0];
  const data = str.slice(3);
  console.log("port: " + port)
  console.log("data: " + data)
  
  if (port == "I"){
    if (data == "save") lichsuIN.save();
    else if(data == "clear") lichsuIN.clear(); 
    else lichsuIN.sothe = data;
  } 
  else if (port == "O"){
    if (data == "save") lichsuOUT.save();
    else if(data == "clear") lichsuOUT.clear(); 
    else lichsuOUT.sothe = data;
  }

});
module.exports = app;




// Tạo 1 đối tượng lichsu gồm các thông tin cần để insert
class lichsu {
  constructor(id_cong, sothe, bienso, id_khachhang, id_nhanvien, thoigianmo, path_anhphuongtien, path_anhbienso) {
    this.id_cong= id_cong, 
    this.sothe= sothe, 
    this.bienso= bienso, 
    this.id_khachhang= id_khachhang, 
    this.id_nhanvien= id_nhanvien, 
    this.thoigianmo= thoigianmo, 
    this.path_anhphuongtien= path_anhphuongtien, 
    this.path_anhbienso= path_anhbienso
  }

  clear() {
    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        delete this[key];
      }
    }
  }

  save(){
    modelCamera.saveLichsu(this.id_cong, this.sothe, this.bienso, this.id_khachhang, this.id_nhanvien, this.thoigianmo, this.path_anhphuongtien, this.path_anhbienso)
  }
}
// Khỏi tạo 2 biến cho 2 cổng với các thuộc tính rỗng
const lichsuIN = new lichsu();
const lichsuOUT = new lichsu();

// lichsuIN.id_cong= "1"
// lichsuIN.sothe= "A1 68 11"
// lichsuIN.bienso= "bienso"
// lichsuIN.id_khachhang= "1"
// lichsuIN.id_nhanvien= "1"
// lichsuIN.thoigianmo= now
// lichsuIN.path_anhphuongtien= "path_anhphuongtien"
// lichsuIN.path_anhbienso= "path_anhbienso"
// console.log(lichsuIN)
// lichsuIN.save()


