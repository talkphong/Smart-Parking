var db = require('../models/database');
var express = require('express');
// var router = express.Router();

const path = require('path')
const urlToAPI = "http://127.0.0.1:8000/process_image"
const pathToUploads = path.join(__dirname, "../uploads")

const fs = require('fs');
const axios = require('axios');
const { Blob } = require('buffer');
const multer  = require('multer');
const sharp = require('sharp');

const app = express()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathToUploads)
  },
  filename: function (req, file, cb) {
  //   cb(null, Date.now() + '-' + file.originalname)
    cb(null, file.originalname)
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


app.get('/', authMiddleware.isStaff, function (req, res, next) {
    res.render('camera');
});

app.post('/upload', upload.single('image'), async (req, res) => {
  const img = `${pathToUploads}/${req.file.originalname}`;
  console.log("Đã lưu ảnh tại: " + img) 

  const imgPath = img
  const imgBufferData = fs.readFileSync(imgPath)
  const imgBlobData = new Blob([imgBufferData]);
  const formData = new FormData()
  formData.append('image', imgBlobData, 'image.jpg');
  const result = await axios.post(urlToAPI, formData)

  console.log(result.data)

  let LpRegion =""
  if (result.data[0] != -1){
      const inputPath = imgPath
      const outputPath = `${pathToUploads}/output.jpg`
      const xmin = result.data[0][0]
      const xmax = result.data[0][1]
      const ymin = result.data[0][2]
      const ymax = result.data[0][3]
      await cropImage(inputPath, outputPath, xmin, xmax, ymin, ymax)
      LpRegion = fs.readFileSync(`${pathToUploads}/output.jpg`)
      if(result.data[1] != -1){
          LpNumber = result.data[1]
      }else{
          LpNumber = "Không nhận diện đủ 8 chữ số"
          console.log("Không nhận diện đủ 8 chữ số")
      }
  }else{
    LpNumber = "Không tìm thấy biển số"
    console.log("Không tìm thấy biển số")
  }
  
  const dataToSend = {
      LpRegion: LpRegion.toString('base64'),  
      LpNumber: LpNumber 
  };
  res.json(dataToSend);
  console.log("xong xuoi")
  fs.unlink(`${pathToUploads}/output.jpg`, (err) => {});
  fs.unlink(`${pathToUploads}/image.jpg`, (err) => {});
})



module.exports = app;
