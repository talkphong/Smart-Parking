#include <WebSocketsClient.h>  //https://github.com/Links2004/arduinoWebSockets
#include <ESP8266WiFi.h>

#include <Wire.h> // dùng để giao tiếp i2c

#define MAX_DATA_LENGTH 20  // độ dài tối đa của dữ liệu gửi từ slave (20byte)
#define arduinoIN 8         // Định nghĩa arduino điều khiển chiều vào có địa chỉ 8
#define arduinoOUT 9         // Định nghĩa arduino điều khiển chiều vào có địa chỉ 9
#define SDA_PIN 5           // Định nghĩa chân SDA là chân D1
#define SCL_PIN 4           // Định nghĩa chân SCL là chân D2

const char* ssid = "Galaxy A235A0C"; //tên wifi
const char* password = "012345678"; //mật khẩu wifi
const char* serverAddress = "192.168.50.72"; // Địa chỉ IP của máy chủ Node.js
const int serverPort = 3000; 

// khai báo các đối tượng
WiFiClient wifiClient;    // thiết lập kết nối wifi và gửi dữ liệu qua wifi
WebSocketsClient webSocket;   // giao tiếp websocket giữa thiết bị và máy chủ

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
  webSocket.onEvent(webSocketEvent);  // đăng kí hàm xử lí sự kiện
}

void loop() {
  webSocket.loop();
  receiveArduinoIN();
  receiveArduinoOUT();
}

//các sự kiện websocket
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("Disconnected from server");
      break;
    case WStype_CONNECTED:
      Serial.println("Connected to server");
      break;
    case WStype_TEXT:
      String message = String((char*)payload);

      // Kiểm tra loại dữ liệu và gọi hàm tương ứng
      if (message.indexOf("I") != -1) {
        // Gọi hàm sendArduino_In và truyền vào dữ liệu từ server
        sendArduino_In(message);
      } else if (message.indexOf("O") != -1) {
        // Gọi hàm sendArduino_Out và truyền vào dữ liệu từ server
        sendArduino_Out(message);
      }
      Serial.println("Du lieu nhan duoc tu Server: " + message);
      break;
  }
}

// GỬI DỮ LIỆU ĐẾN SERVER
void sendServer(String message){
  webSocket.sendTXT(message);
}

//GỬI DỮ LIỆU ĐẾN ARDUINO_IN
void sendArduino_In(String message){
  Wire.beginTransmission(arduinoIN); // Bắt đầu luồng đến thiết bị số 8
  Wire.write(message.c_str());  // gửi dữ liệu 
  Wire.endTransmission();    // Kết thúc
}

// GỬI DỮ LIỆU ĐẾN ARDUINO_OUT
void sendArduino_Out(String message){
  Wire.beginTransmission(arduinoOUT); // Bắt đầu luồng đến thiết bị số 8
  Wire.write(message.c_str());  // gửi dữ liệu 
  Wire.endTransmission();    // Kết thúc
}

// NHẬN DỮ LIỆU TỪ ARDUINO_IN
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
  if( String( myArray)!= ""){
    Serial.println("Du lieu nhan duoc tu ArduinoIN: " + String(myArray));
    sendServer("IN: "+ String(myArray)); // gọi hàm gủi đến server
  }
}

// NHẬN DỮ LIỆU TỪ ARDUINO_OUT
void receiveArduinoOUT(){
  int i = 0;
  char x, myArray[MAX_DATA_LENGTH] = "";
  Wire.requestFrom(arduinoOUT, MAX_DATA_LENGTH); // Yêu cầu thiết bị số 8 gửi 1 đoạn dữ liệu có độ lớn 20byte
  do
  {
    x = Wire.read();
    myArray[i] = x;
    i++;
  }
  while (x != '\n');
  myArray[i - 1] = 0x00;   //thêm tín hiệu kết thúc vào chuỗi khi gặp ký tự \n
  if( String( myArray)!= ""){
    Serial.println("Du lieu nhan duoc tu ArduinoOUT: " + String(myArray));
    sendServer("OUT: "+ String(myArray)); // gọi hàm gủi đến server
  }
}