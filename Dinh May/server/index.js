const path = require('path')
const PORT = 3000
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

// Định nghĩa route cho Express
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Khởi động máy chủ Express trên cổng 3000
server.listen(PORT, () => {
  console.log(`Express Server running on PORT ${PORT}`);
});

const ws = new WebSocket.Server({ server });

var clients = [] // khởi tạo danh sách các cl
//hàm truyền dữ liệu: gửi dữ liệu cho tất cả cl khác, ngoại từ cl đã gửi dữ liệu lên sv
function broadcast(socket, message) {
  console.log(clients.length);
  for (var i = 0; i < clients.length; i++) {
      if (clients[i] != socket) {
          clients[i].send(message.toString());
      }
  }
}
function broadcast(socket, message2) {
  console.log(clients.length);
  for (var i = 0; i < clients.length; i++) {
      if (clients[i] != socket) {
          clients[i].send(message2.toString());
      }
  }
}

//sự kiện kết nối
ws.on('connection', function connection(socket) {
  console.log('A client connected'); //Thông báo đã có 1 client kết nối đến server
  clients.push(socket); //khi có 1 cl kết nối đến sv, thêm cl đó vào danh sách

  //sự kiện có tin nhắn từ cl gửi đến sv
  socket.on('message', function incoming(message) {
    console.log('Received: %s', message);
    // Xử lý tin nhắn nhận được ở đây (nếu cần)
    broadcast(socket, message);// Phản hồi lại client
  });
  socket.on('message2', function incoming(message2) {
    console.log('Received: %s', message2);
    // Xử lý tin nhắn nhận được ở đây (nếu cần)
    broadcast(socket, message2);// Phản hồi lại client
  });

  //sự kiện kết thúc (cl ngắt kết nối)
  socket.on('close', function() {
    console.log('Client disconnected');

    var index = clients.indexOf(socket); // Lấy vị trí của cl đã ngắt kết nốt
    clients.splice(index, 1); // khi 1 cl ngắt kết nối, loại bỏ cl đó ra khỏi danh sách
  });
});