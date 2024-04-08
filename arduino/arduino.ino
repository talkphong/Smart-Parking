/* ------------------------------------ *
 *                          Arduino     *  
 *                          Uno/101     *  
 *             Pin            Pin       * 
 * ------------------------------------ *
 *             RST          9           *
 *             SDA(SS)      10          *
 *  MFRC522    MOSI         11 / ICSP-4 *
 *             MISO         12 / ICSP-1 *
 *             SCK          13 / ICSP-3 *
 */

// Thư viện
#include <Wire.h> // dùng để giao tiếp i2c

#include <Servo.h>

#include <SPI.h>
#include <MFRC522.h> // MFRC522 by githubCommunity 1.4.11


/*********** CHÂN CẮM ***********/
#define sensor_PIN 2 // Chân của cảm biến

#define servo_PIN 3 // Chân của servo

#define light_R 5 // Các chân của đèn giao thông
#define light_Y 6
#define light_G 7

#define RFID_RST_PIN 9
#define RFID_SS_PIN 10

#define btn_Open_PIN 4
#define btn_Close_PIN 8
/*______________________________*/


/*********** KHAI BÁO ĐỐI TƯỢNG ***********/
MFRC522 mfrc522(RFID_SS_PIN, RFID_RST_PIN); // RFID

Servo myservo; // Servor
/*______________________________*/


/*********** KHAI BÁO BIẾN ***********/
#define SLAVE_ADDRESS 8 // Địa chỉ của thiết bị này
bool btn_Open_State;
bool btn_Close_State; 
bool btn_Open_preState;
bool btn_Close_preState; 

String card_UID = "";   // Lưu UID của thẻ

bool sensor_preState;
bool sensor_State;      // Trạng thái của cảm biến: (0)-có vật thể , (1)-không có vật thể 

int servo_Open = 90;    // Góc để servo quay khi mở
int servo_Close = 180;  // Góc để servo quay khi đóng

String message = "";    // Tin nhắn nhận được từ ESP
/*______________________________*/



/*********************************** MAIN ***********************************/
void setup() {
  Serial.begin(9600);

  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println(" RFID Init DONE!");

  pinMode(light_R, OUTPUT);
  pinMode(light_Y, OUTPUT);
  pinMode(light_G, OUTPUT);

  pinMode(sensor_PIN, INPUT);

  myservo.attach(servo_PIN); 

  Wire.begin(SLAVE_ADDRESS);    // Khởi tạo thiết bị này có địa chỉ 8
  Wire.onReceive(receiveEvent); // Đăng ký hàm nhận dữ liệu
  Wire.onRequest(sendDataToESP); // Đăng ký hàm gửi dữ liệu
}


void loop() {
  btnControl();
  servoControl();
  lightControl();
  readCard();
}
/*____________________________________________________________________________________________*/


/*********************************** ĐIỀU KHIỂN LINH KIỆN ***********************************/
void btnControl(){
  btn_Open_State = digitalRead(btn_Open_PIN);
  btn_Close_State = digitalRead(btn_Close_PIN);

  if (btn_Open_State == 0 and btn_Open_preState == 1){
    myservo.write(servo_Open);
  }
  else if (btn_Close_State == 0 and btn_Close_preState == 1){
    myservo.write(servo_Close);
  }

  btn_Open_preState = btn_Open_State;
  btn_Close_preState = btn_Close_State; 
}

void readCard(){
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
	if ( ! mfrc522.PICC_IsNewCardPresent()) {
		return;
	}

	// Select one of the cards
	if ( ! mfrc522.PICC_ReadCardSerial()) {
		return;
	}
  card_UID= "";
  // Đọc qua từng byte trong chuỗi uid của thẻ
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    card_UID += (mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    card_UID += String(mfrc522.uid.uidByte[i], HEX);          // dịch byte đọc được sang mã HEX và gán vào biến
    card_UID.toUpperCase();
    card_UID.trim();
  }
  Serial.println("UID: " + card_UID);

  mfrc522.PICC_HaltA();       // dừng giao tiếp với thẻ.
  mfrc522.PCD_StopCrypto1();  // dừng quá trình mã hóa.
}

void lightControl(){
  int servo_angle = myservo.read();
  if( servo_angle == servo_Close ) {
    digitalWrite(light_R, HIGH);
    digitalWrite(light_Y, LOW);
    digitalWrite(light_G, LOW);
  }
  else if( servo_angle == servo_Open ) {
    digitalWrite(light_R, LOW);
    digitalWrite(light_Y, LOW);
    digitalWrite(light_G, HIGH);
  }
  else {
    digitalWrite(light_R, LOW);
    digitalWrite(light_Y, HIGH);
    digitalWrite(light_G, LOW);
  }
}

void servoControl(){
  sensor_State = digitalRead(sensor_PIN);

  if(sensor_State == 1) {
    if (sensor_preState == 0){
      myservo.write(servo_Close);
    }
  }

  sensor_preState = sensor_State;
}

/*____________________________________________________________________________________________*/



/*********************************** GIAO TIẾP ESP ***********************************/
// Gửi dữ liệu đến ESP
void sendDataToESP() {
    String a = card_UID; // test dữ liệu gủi đi. ở đây có thay bằng UID đọc được
    Wire.write(a.c_str());
    Wire.write("\n");
    card_UID= "";
}

// Nhận dữ liệu từ ESP
void receiveEvent() {
    message = "";
    Serial.print("From ESP: ");
    while (0 <Wire.available()) {
      char c = Wire.read();
      message += c;
    }
    Serial.println(message);

    if( message == "Open") {
      myservo.write(servo_Open);
    }
    else if( message == "Close") {
      myservo.write(servo_Close);
    }        
}
/*____________________________________________________________________________________________*/
