#include <Wire.h> // dùng để giao tiếp i2c
#define SLAVE_ADDRESS 8

void setup() {
 Wire.begin(SLAVE_ADDRESS);    // Khởi tạo thiết bị này có địa chỉ 8
 Wire.onReceive(receiveEvent); // Đăng ký hàm nhận dữ liệu
 Wire.onRequest(requestEvent); // Đăng ký hàm gửi dữ liệu
  Serial.begin(9600);          // khởi tạo UART cứng (Để giao tiếp với máy tính, in ra serial monitor)
  Serial.println("arduino 8 start");             

}

void loop() {
}

// NHẬN DỮ LIỆU TỪ ESP
void receiveEvent(int howMany) {
  Serial.print("From ESP: ");
  while (0 <Wire.available()) {
    char c = Wire.read();
    Serial.print(c);
  }
  Serial.println();             
}

// GỬI DỮ LIỆU ĐẾN ESP
void requestEvent() {
  Serial.println("b");
  String a = String(random(100)) + " " + String(random(100)); // test dữ liệu gủi đi. ở đây có thay bằng UID đọc được
  Wire.write(a.c_str());
  Wire.write("\n");
  Serial.println("a");
}