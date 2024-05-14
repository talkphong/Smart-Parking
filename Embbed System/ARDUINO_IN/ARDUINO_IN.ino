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
#define light_Y 6
#define light_G 5

#define RFID_RST_PIN 9
#define RFID_SS_PIN 10
/*______________________________*/


/*********** KHAI BÁO ĐỐI TƯỢNG ***********/
MFRC522 mfrc522(RFID_SS_PIN, RFID_RST_PIN); // RFID

Servo myservo; // Servor
/*______________________________*/


/*********** KHAI BÁO BIẾN ***********/
#define SLAVE_ADDRESS 8 // Địa chỉ của thiết bị này

String card_UID = "";   // Lưu UID của thẻ

bool flag;
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
  Serial.println(" Day la cong vao- INPUT!");

  pinMode(light_R, OUTPUT);
  pinMode(light_Y, OUTPUT);
  pinMode(light_G, OUTPUT);

  pinMode(sensor_PIN, INPUT);

  myservo.attach(servo_PIN); 
  myservo.write( 0);

  Wire.begin(SLAVE_ADDRESS);    // Khởi tạo thiết bị này có địa chỉ 8
  Wire.onReceive(receiveEvent); // Đăng ký hàm nhận dữ liệu
  Wire.onRequest(sendDataToESP); // Đăng ký hàm gửi dữ liệu
}


void loop() {
  //controlServo();
  servoControl();
  lightControl();
  readCard();
}
/*____________________________________________________________________________________________*/


/*********************************** ĐIỀU KHIỂN LINH KIỆN ***********************************/
void readCard(){
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
	if ( ! mfrc522.PICC_IsNewCardPresent()) {   // kiểm tra xem có thẻ mới được đọc hay không
		return;
	}

	// Select one of the cards
	if ( ! mfrc522.PICC_ReadCardSerial()) {   // đọc dữ liệu sau khi phát hiện thẻ
		return;
	}
  card_UID= "";
  // Đọc qua từng byte trong chuỗi uid của thẻ
  for (byte i = 0; i < mfrc522.uid.size; i++) {   // duyệt qua từng byte trong dãy byte của thẻ
    card_UID += (mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");  
    card_UID += String(mfrc522.uid.uidByte[i], HEX);          // dịch byte đọc được sang mã HEX và gán vào biến
    card_UID.toUpperCase();
    card_UID.trim();    // loại bỏ kí tự khoảng trắng ở đầu và cuối
  }
  Serial.println("UID: " + card_UID);

  mfrc522.PICC_HaltA();       // dừng giao tiếp với thẻ.
  mfrc522.PCD_StopCrypto1();  // dừng quá trình mã hóa.
}

/*____________________________________________________________________________________________*/



/*********************************** GIAO TIẾP ESP ***********************************/
// Gửi dữ liệu đến ESP
void sendDataToESP() {
    String a = card_UID; 
    Wire.write(a.c_str());  // chuyển đổi chuỗi kí tự thành một mảng byte
    Wire.write("\n");
    card_UID= "";
}

// Nhận dữ liệu từ ESP
void receiveEvent() {
    message = "";
    Serial.print("Du lieu nhan duoc tu ESP: ");
    while (0 <Wire.available()) {   // kiểm tra dữ liệu có sẵn hay không
      char c = Wire.read();
      message += c;
    }
    Serial.println(message);

    if( message == "OpenIn") {
      myservo.write(servo_Open);
      flag= 1;
    }
    else if( message == "CloseIn") {
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

void servoControl(){  
  sensor_State = digitalRead(sensor_PIN);
  if(sensor_State == 0) {
    Serial.println("Phat hien co phuong tien- Dong servo");
    myservo.write(servo_Close);
    flag= 0;
  }
}

void controlServo() {
  //đọc tín hiệu button
  int button1 = digitalRead(8);
  int button2 = digitalRead(7);

  if( button1== LOW) {
    myservo.write(servo_Open);
    flag= 1;
    Serial.println( "Mo cong vao thu cong");
  }
  if( button2== LOW) {
    myservo.write(servo_Close);
    flag= 0;
    Serial.println( "Dong cong vao thu cong");
  }
}
/*____________________________________________________________________________________________*/
