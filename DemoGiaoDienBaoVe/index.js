const path = require('path')

const fs = require('fs');
const axios = require('axios');
const { Blob } = require('buffer');
const multer  = require('multer');
const sharp = require('sharp');

const express = require('express');
const http = require('http');

const app = express()
const server = http.createServer(app);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
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


// app.use('/getImageData', express.static('uploads/output.jpg'));

app.post('/upload', upload.single('image'), async (req, res) => {
    const img = `uploads/${req.file.originalname}`;
    console.log("Đã lưu ảnh tại: " + img) 
  
    const imgPath = path.join(__dirname, img)
    const imgBufferData = fs.readFileSync(imgPath)
    const imgBlobData = new Blob([imgBufferData]);
    const formData = new FormData()
    formData.append('image', imgBlobData, 'image.jpg');
    const result = await axios.post("http://localhost:8000/process_image", formData)
  
    console.log(result.data)
  
    let LpRegion =""
    if (result.data[0] != -1){
        const inputPath = imgPath
        const outputPath = "uploads/output.jpg"
        const xmin = result.data[0][0]
        const xmax = result.data[0][1]
        const ymin = result.data[0][2]
        const ymax = result.data[0][3]
        await cropImage(inputPath, outputPath, xmin, xmax, ymin, ymax)
        LpRegion = fs.readFileSync("uploads/output.jpg")
        if(result.data[1] != -1){
            LpNumber = result.data[1]
        }else{
            LpNumber = 0
            console.log("Không nhận diện đủ 8 chữ số")
        }
    }else{
      LpNumber = 0
      console.log("Không tìm thấy biển số")
    }
    
    const dataToSend = {
        LpRegion: LpRegion.toString('base64'),  
        LpNumber: LpNumber 
    };
    res.json(dataToSend);
    console.log("xong xuoi")
    fs.unlink(path.join(__dirname + "/uploads/", "output.jpg"), (err) => {});
    fs.unlink(path.join(__dirname + "/uploads/", "image.jpg"), (err) => {});
  })

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'index.html'))
}) 

server.listen(3000)