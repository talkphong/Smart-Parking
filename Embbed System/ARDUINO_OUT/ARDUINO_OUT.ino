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

#define light_R 4 // Các chân của đèn giao thông
#define light_Y 5
#define light_G 6

#define RFID_RST_PIN 9
#define RFID_SS_PIN 10
/*______________________________*/


/*********** KHAI BÁO ĐỐI TƯỢNG ***********/
MFRC522 mfrc522(RFID_SS_PIN, RFID_RST_PIN); // RFID

Servo myservo; // Servor

const int button = 8;  // chân kết nối nút nhấn
/*______________________________*/


/*********** KHAI BÁO BIẾN ***********/
#define SLAVE_ADDRESS 9 // Địa chỉ của thiết bị này

String card_UID = "";   // Lưu UID của thẻ

bool sensor_preState;
bool sensor_State;      // Trạng thái của cảm biến: (0)-có vật thể , (1)-không có vật thể 

int servo_Open = 90;    // Góc để servo quay khi mở
int servo_Close = 0;  // Góc để servo quay khi đóng

int buttonState = 0;       // biến lưu trạng thái hiện tại của nút nhấn
int lastButtonState = 0;   // biến lưu trạng thái trước đó của nút nhấn
bool isServoOpen = servo_Close;  // biến lưu trạng thái mở/đóng của servo

String message = "";    // Tin nhắn nhận được từ ESP
/*______________________________*/



/*********************************** MAIN ***********************************/
void setup() {
  Serial.begin(9600);

  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("RFID Init DONE!");
  Serial.println("Day la cong ra- OUTPUT!");

  pinMode(light_R, OUTPUT);
  pinMode(light_Y, OUTPUT);
  pinMode(light_G, OUTPUT);

  // khai báo button
  pinMode(button, INPUT);  

  pinMode(sensor_PIN, INPUT);

  myservo.attach(servo_PIN); 
  myservo.write( servo_Close);

  isServoOpen = false; // Cập nhật trạng thái ban đầu của servo
  lastButtonState = digitalRead(button); // Khởi tạo trạng thái nút nhấn

  Wire.begin(SLAVE_ADDRESS);    // Khởi tạo thiết bị này có địa chỉ 8
  Wire.onReceive(receiveEvent); // Đăng ký hàm nhận dữ liệu
  Wire.onRequest(sendDataToESP); // Đăng ký hàm gửi dữ liệu
}


void loop() {
  controlServo();
  sensorControl();
  lightControl();
  readCard();
}
/*____________________________________________________________________________________________*/


/*********************************** ĐIỀU KHIỂN LINH KIỆN ***********************************/
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

/*____________________________________________________________________________________________*/



/*********************************** GIAO TIẾP ESP ***********************************/
// Gửi dữ liệu đến ESP
String msg = "";
void sendDataToESP() {
  if (msg != ""){
    Wire.write(msg.c_str());  // chuyển đổi chuỗi kí tự thành một mảng byte
    Wire.write("\n");
    msg= "";
  }
    String a = card_UID; // test dữ liệu gủi đi. ở đây có thay bằng UID đọc được
    Wire.write(a.c_str());
    Wire.write("\n");
    card_UID= "";
}
bool flag;
// Nhận dữ liệu từ ESP
void receiveEvent() {
    message = "";
    Serial.print("Du lieu nhan duoc tu ESP: ");
    while (0 <Wire.available()) {
      char c = Wire.read();
      message += c;
    }
    Serial.println(message);

    if( message == "OpenOut") {
      myservo.write(servo_Open);
      isServoOpen = !isServoOpen;
      flag= 1;
    }
    else if( message == "CloseOut") {
      myservo.write(servo_Close);
      flag= 0;
    }        
}

void lightControl(){
  if( flag == 0) {
    digitalWrite(light_R, HIGH);
    digitalWrite(light_Y, LOW);
    digitalWrite(light_G, LOW);
  }
  else if( flag== 1 ) {
    digitalWrite(light_R, LOW);
    digitalWrite(light_Y, LOW);
    digitalWrite(light_G, HIGH);
  }
}

void sensorControl(){  
  sensor_State = digitalRead(sensor_PIN);
  if(sensor_State == 0) {
    if (isServoOpen) {
      Serial.println("Phuong tien da di qua - Dong servo");
      myservo.write(servo_Close);
      msg = "save";
      flag= 0;
      isServoOpen = false; // cập nhật trạng thái servo
    }
  }
}

void controlServo() {
  //đọc tín hiệu button
  buttonState = digitalRead( button);

  // kiểm tra nếu nút được nhấn
  if (buttonState != lastButtonState) {
    // nếu trạng thái nút đã thay đổi và nút đang được nhấn
    if (buttonState == HIGH) {
      // thay đổi trạng thái của servo
      if (isServoOpen) {
        myservo.write(servo_Close);
        Serial.println("Dong servo");
        flag= 0;
        msg = "clear";
      } else {
        myservo.write(servo_Open);
        Serial.println("Mo servo");
        flag= 1;
      }
      // đảo ngược trạng thái servo
      isServoOpen = !isServoOpen;
    }
    // delay nhỏ để chống dội nút
    delay(10);
  }

  // lưu trạng thái nút nhấn để kiểm tra lần lặp sau
  lastButtonState = buttonState;
}

// void controlServo() {
//   //đọc tín hiệu button
//   int button1 = digitalRead(8);
//   int button2 = digitalRead(7);

//   if( button1== LOW) {
//     myservo.write(servo_Open);
//     flag= 1;
//     Serial.println( "Mo cong ra thu cong");
//   }
//   if( button2== LOW) {
//     myservo.write(servo_Close);
//     flag= 0;
//     Serial.println( "Dong cong ra thu cong");
//   }
// }
/*____________________________________________________________________________________________*/
