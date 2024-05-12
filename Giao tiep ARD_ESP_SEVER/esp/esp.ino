#include <WebSocketsClient.h>  //https://github.com/Links2004/arduinoWebSockets
#include <ESP8266WiFi.h>

#include <Wire.h> // dùng để giao tiếp i2c

#define MAX_DATA_LENGTH 20  // độ dài tối đa của dữ liệu gửi từ slave (20byte)
#define arduinoIN 8         // Định nghĩa arduino điều khiển chiều vào có địa chỉ 8
#define SDA_PIN 5           // Định nghĩa chân SDA là chân D1
#define SCL_PIN 4           // Định nghĩa chân SCL là chân D2

const char* ssid = "Phong Truong";            //tên wifi
const char* password = "cuong1972";           //mật khẩu wifi
const char* serverAddress = "192.168.55.107"; // Địa chỉ IP của máy chủ Node.js (cmd -> ipconfig)
const int serverPort = 3000;                  // Cổng của máy chủ Node.js

WiFiClient wifiClient;
WebSocketsClient webSocket;

void setup() {
  Serial.begin(9600); // khởi tạo UART cứng (Để giao tiếp với máy tính, in ra serial monitor)
  Wire.begin(SDA_PIN, SCL_PIN); // Dùng để giao tiếp i2c với arduino (SDA = D1, SCL = D2)

  // Kết nối tới mạng wifi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Kết nối tới máy chủ Node.js qua WebSockets
  webSocket.begin(serverAddress, serverPort, "/");
  webSocket.onEvent(webSocketEvent);  
}

void loop() {
  webSocket.loop();
  // receiveArduinoIN();
  sendServer();
}

//các sự kiện websocket
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED: // sự kiện ngắt kết nối
      Serial.println("Disconnected from server");
      break;
    case WStype_CONNECTED: //sự kiện kết nối
      Serial.println("Connected to server");
      break;
    case WStype_TEXT: // NHẬN DỮ LIỆU TỪ SERVER
      String message = String((char*)payload);
      Serial.println("From Server: " + message );
      sendArduino(message); //Sau khi nhận dữ liệu từ sv thì gửi nó đến arduino
      break;
  }
}

// GỬI DỮ LIỆU ĐẾN SERVER
void sendServer(String message){
  // //nhập chuỗi từ bàn phím sau đó gửi chuỗi đó lên sv, in ra màn hình
  // if (Serial.available() > 0) {
  //   String input = Serial.readStringUntil('\n'); //nhập chuỗi input từ bàn phím
  //   webSocket.sendTXT(input); // gửi chuỗi input lên sv
  //   Serial.println("You entered: " + input);  //hiển thị chuỗi đó lên terminal
  // }
  webSocket.sendTXT(message);
}

void sendServer(){
  //nhập chuỗi từ bàn phím sau đó gửi chuỗi đó lên sv, in ra màn hình
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n'); //nhập chuỗi input từ bàn phím
    webSocket.sendTXT(input); // gửi chuỗi input lên sv
    Serial.println("You entered: " + input);  //hiển thị chuỗi đó lên terminal
  }
}

// GỬI DỮ LIỆU ĐẾN ARDUINO
void sendArduino(String message){
  // if (Serial.available() > 0) {
  //   Wire.beginTransmission(arduinoIN); // Bắt đầu luồng đến thiết bị số 8
  //   String input = Serial.readStringUntil('\n'); //nhập chuỗi input từ bàn phím
  //   Wire.write(input.c_str());  // gửi dữ liệu 
  //   Serial.println("You entered: " + input);  //hiển thị chuỗi đó lên terminal
  //   Wire.endTransmission();    // Kết thúc
  // }

  Wire.beginTransmission(arduinoIN); // Bắt đầu luồng đến thiết bị số 8
  Wire.write(message.c_str());  // gửi dữ liệu 
  Wire.endTransmission();    // Kết thúc
}

// NHẬN DỮ LIỆU TỪ ARDUINO
void receiveArduinoIN(){
  int i = 0;
  char x, myArray[MAX_DATA_LENGTH] = "";
  Wire.requestFrom(arduinoIN, MAX_DATA_LENGTH); // Yêu cầu thiết bị số 8 gửi 1 đoạn dữ liệu có độ lớn 20byte
  do
  {
    x = Wire.read();
    myArray[i] = x;
    i++;
  }
  while (x != '\n');
  myArray[i - 1] = 0x00;   //thêm tín hiệu kết thúc vào chuỗi khi gặp ký tự \n
  Serial.println("From ArduinoIN: " + String(myArray));
  sendServer(String(myArray)); // sau khi nhận dữ liệu từ arduino thì gửi nó đến server
}