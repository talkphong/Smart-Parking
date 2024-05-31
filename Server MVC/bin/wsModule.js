const WebSocket = require('ws');

function startWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    // wss.on('connection', function connection(ws) {
    //     console.log('Có người kết nối!');

    //     // Xử lý thông điệp từ client
    //     ws.on('message', function incoming(message) {
    //         console.log('Đã nhận được thông điệp từ client: %s', message);
    //     });

    //     // Gửi thông điệp cho client
    //     ws.send('Xin chào, bạn đã kết nối thành công với WebSocket server!');
    // });
}

module.exports = { startWebSocketServer };
