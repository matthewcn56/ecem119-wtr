#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include "secret.h"
#include "time.h"

// Provide the token generation process info.
#include <addons/TokenHelper.h>

// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
// include library to read and write from flash memory
#include <Preferences.h>

// define the number of bytes you want to access
#define PERSISTENT_CODE_SIZE 6

#define LED 2

//CONSTANTS FOR NUMBER GEN

Adafruit_MPU6050 mpu;

Preferences preferences;

String pairingCode = "";

uint64_t lastDrankTimestamp =0;


//getting today's date

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = -28800;
const int   daylightOffset_sec = 3600;



const int trigPin = 4;
const int echoPin = 23;
const float AVG_THRESHOLD = 0.5;

//define sound speed in cm/uS
#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701

long duration;
float distanceCm;
float distanceInch;
float lastSent = 0;
float lastSentPercentage =0;
float lastFiveReadingsCM[5] ={-1,-1,-1,-1,-1};
int SEND_INTERVAL = 1000;
int READ_INTERVAL = 250/2;
unsigned long lastReadTime = 0;

int CODE_LEN = 6;

int BLINK_INTERVAL = 100;
unsigned long lastBlinkTime=0;

float CM_DIFF_THRESHOLD = 1;
bool taskCompleted = false;
float SUSSY_THRESHOLD = 0.3;

const int buttonPin = 5;
int buttonState = 0;  // variable for reading the pushbutton status

bool attemptingPairing = false;


float MAX_VOLUME = 1000;
float MAX_CM = 17.5;

int PAST_READINGS_SIZE = 5;

String BOTTLE_ID = "mattchoo_test";

bool shouldUpdate = false;
int valuesRead = 0;

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;


//helper function to add reading to list of values
void addReading(float newVal) {
  // 1 2 3 4 5
  // 2 3 4 5 6
  // 3 4 5 6 7
  // 4 5 6 7 8
  size_t dataSize = (PAST_READINGS_SIZE - 1) * sizeof(float);

  //move starting from 2nd into 1st
  memmove(&lastFiveReadingsCM[0], &lastFiveReadingsCM[1], dataSize);
  if(valuesRead<PAST_READINGS_SIZE){
    lastFiveReadingsCM[valuesRead] = newVal;
  }
  else {
    lastFiveReadingsCM[PAST_READINGS_SIZE-1] = newVal;
  }
  if(valuesRead<5)
    valuesRead++;
  
}

//helper fn to calc the avg reading of our past reading array
float calcAvgReading(){
  float runningTotal=0;
  for(int i=0;i<PAST_READINGS_SIZE;i++)
    runningTotal+= lastFiveReadingsCM[i];
  return runningTotal/PAST_READINGS_SIZE;
}

float cmToPercentage(float cm){
  float initialCalc = 1-(cm/MAX_CM);
  if(initialCalc>1){
    return 1;
  }
  if(initialCalc<0){
    return 0;
  }
  return initialCalc;
}

//helper fn print local time
void printLocalTime(){
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
  Serial.print("Day of week: ");
  Serial.println(&timeinfo, "%A");
  Serial.print("Month: ");
  Serial.println(&timeinfo, "%B");
  Serial.print("Day of Month: ");
  Serial.println(&timeinfo, "%d");
  Serial.print("Year: ");
  Serial.println(&timeinfo, "%Y");
  Serial.print("Hour: ");
  Serial.println(&timeinfo, "%H");
  Serial.print("Hour (12 hour format): ");
  Serial.println(&timeinfo, "%I");
  Serial.print("Minute: ");
  Serial.println(&timeinfo, "%M");
  Serial.print("Second: ");
  Serial.println(&timeinfo, "%S");

  Serial.println("Time variables");
  char timeHour[3];
  strftime(timeHour,3, "%H", &timeinfo);
  Serial.println(timeHour);
  char timeWeekDay[10];
  strftime(timeWeekDay,10, "%A", &timeinfo);
  Serial.println(timeWeekDay);
  Serial.println();
}


//returns true if avg is past CM_DIFF_THRESHOLD and took at least PAST_READINGS_SIZE readings, false otherwise
bool determineUpdate(){
  if (valuesRead < PAST_READINGS_SIZE){
    return false;
  }
  float avgTotal = calcAvgReading();
  float readingDiff = avgTotal - lastSent;
  //check if threshold reached
  if(readingDiff > CM_DIFF_THRESHOLD || readingDiff<-CM_DIFF_THRESHOLD){
    // Serial.print("Should update with: ");
    // Serial.println(avgTotal);
    //only update if all values within stabilized threshold
    for(int i=0;i<PAST_READINGS_SIZE;i++){
      if (lastFiveReadingsCM[i] < (avgTotal -AVG_THRESHOLD) || lastFiveReadingsCM[i] > (avgTotal+ AVG_THRESHOLD) ) {
        return false;
      }
    }
    return true;
  }
  else {
    return false;
  }


}

void setup() {
  Serial.begin(115200); // Starts the serial communication
  while (!Serial)
    delay(10); // will pause Zero, Leonardo, etc until serial console opens
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input

  pinMode(buttonPin, INPUT); //button pin input

  pinMode(LED,OUTPUT);

  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");


  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  Serial.print("Accelerometer range set to: ");
  switch (mpu.getAccelerometerRange()) {
  case MPU6050_RANGE_2_G:
    Serial.println("+-2G");
    break;
  case MPU6050_RANGE_4_G:
    Serial.println("+-4G");
    break;
  case MPU6050_RANGE_8_G:
    Serial.println("+-8G");
    break;
  case MPU6050_RANGE_16_G:
    Serial.println("+-16G");
    break;
  }
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  Serial.print("Gyro range set to: ");
  switch (mpu.getGyroRange()) {
  case MPU6050_RANGE_250_DEG:
    Serial.println("+- 250 deg/s");
    break;
  case MPU6050_RANGE_500_DEG:
    Serial.println("+- 500 deg/s");
    break;
  case MPU6050_RANGE_1000_DEG:
    Serial.println("+- 1000 deg/s");
    break;
  case MPU6050_RANGE_2000_DEG:
    Serial.println("+- 2000 deg/s");
    break;
  }

  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  Serial.print("Filter bandwidth set to: ");
  switch (mpu.getFilterBandwidth()) {
  case MPU6050_BAND_260_HZ:
    Serial.println("260 Hz");
    break;
  case MPU6050_BAND_184_HZ:
    Serial.println("184 Hz");
    break;
  case MPU6050_BAND_94_HZ:
    Serial.println("94 Hz");
    break;
  case MPU6050_BAND_44_HZ:
    Serial.println("44 Hz");
    break;
  case MPU6050_BAND_21_HZ:
    Serial.println("21 Hz");
    break;
  case MPU6050_BAND_10_HZ:
    Serial.println("10 Hz");
    break;
  case MPU6050_BAND_5_HZ:
    Serial.println("5 Hz");
    break;
  }

  // Open Preferences with my-app namespace. Each application module, library, etc
  // has to use a namespace name to prevent key name collisions. We will open storage in
  // RW-mode (second parameter has to be false).
  // Note: Namespace name is limited to 15 chars.
  preferences.begin("wtr", false);





  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  // Comment or pass false value when WiFi reconnection will control by your code or third party library e.g. WiFiManager
  Firebase.reconnectNetwork(true);

  // Since v4.4.x, BearSSL engine was used, the SSL buffer need to be set.
  // Large data transmission may require larger RX buffer, otherwise connection issue or data read time out can be occurred.
  fbdo.setBSSLBufferSize(4096 /* Rx buffer size in bytes from 512 - 16384 */, 1024 /* Tx buffer size in bytes from 512 - 16384 */);

  // Or use legacy authenticate method
  // config.database_url = DATABASE_URL;
  // config.signer.tokens.legacy_token = "<database secret>";

  // To connect without auth in Test Mode, see Authentications/TestMode/TestMode.ino

  Firebase.begin(&config, &auth);

  //TODO: get last sent

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  delay(5000);
  printLocalTime();
}


//read distance with ultrasonic
void readDistance(){
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  
  // Calculate the distance
  distanceCm = duration * SOUND_SPEED/2;
  
  // Convert to inches
  distanceInch = distanceCm * CM_TO_INCH;
  
  // Prints the distance in the Serial Monitor

  // Serial.print("Distance (inch): ");
  // Serial.println(distanceInch);
  //ensuring it's a valid reading

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float ay = 0;

  ay = a.acceleration.y;

  //only valid if above sussy threshold and is upright
  if(distanceCm >SUSSY_THRESHOLD && ay >8){
     Serial.print("ay: ");
    Serial.println(ay);
    Serial.print("Distance (cm): ");
    Serial.println(distanceCm);
    addReading(distanceCm);
  }
}

String generateRandomString(int length) {
  String characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  String randomString = "";
  
  for (int i = 0; i < length; i++) {
    int randomIndex = random(characters.length());
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

void pairBlink(){
  for(int i=0;i<5;i++){
  digitalWrite(LED, HIGH);
  delay(100);
  digitalWrite(LED,LOW);
  delay(100);
  }
}

void initiatePair(){
  pairBlink();
  bool exists = true;
  //generate random 8 digit code
  String code = "";
  //check if it exists in firebase
  while(exists==true){
    code = generateRandomString(CODE_LEN);
    if (Firebase.getJSON(fbdo, "/waterBottles/" +code)) {
      Serial.print(code);
      Serial.println(" already exists");
    }
    else {
      exists= false;
    }
  }

  Serial.print("Generated code: ");
  Serial.println(code);

  FirebaseJson defaultWaterBottle;

  // { 
  //   currentWaterVolume: 0,
  //   lastDrankTime: 0,
  //   maxVolume: 1000,
  //   name: ""
  // }
  defaultWaterBottle.add("currentWaterVolume",0);
  defaultWaterBottle.add("lastDrinkTime",0);
  defaultWaterBottle.add("maxVolume",1000);
  defaultWaterBottle.add("name","");


  bool didSet = Firebase.setJSON(fbdo, "/waterBottles/"+code, defaultWaterBottle);
  if(didSet){
    Serial.print("Made default water bottle with code: ");
    Serial.println(code);
    attemptingPairing = false;
  }
  else {
    Serial.println("Error initiating pairing");
  }



}





void loop() {
  //read if READ_INTERVAL millis have passed
  if (millis() - lastReadTime > READ_INTERVAL){ 
    readDistance();
    lastReadTime = millis();
  }

  bool shouldUpdate = determineUpdate();

  buttonState = digitalRead(buttonPin);

  if (buttonState == HIGH) {
   if(!attemptingPairing){
    Serial.println("Attempting pairing!");
    attemptingPairing = true;
    initiatePair();
   }
  } 

  //only send updated value and timestamp if should update
  if (Firebase.ready() && !taskCompleted && shouldUpdate )
  {
    taskCompleted = true;

    Serial.printf("Set timestamp... %s\n", Firebase.setTimestamp(fbdo, "/waterBottles/" +BOTTLE_ID + "/lastDrankTime") ? "ok" : fbdo.errorReason().c_str());

    if (fbdo.httpCode() == FIREBASE_ERROR_HTTP_CODE_OK)
    {
      // In setTimestampAsync, the following timestamp will be 0 because the response payload was ignored for all async functions.

      // Timestamp saved in millisecond, get its seconds from int value
      Serial.print("TIMESTAMP (Seconds): ");
      Serial.println(fbdo.to<int>());


      // Or print the total milliseconds from double value
      // Due to bugs in Serial.print in Arduino library, use printf to print double instead.
      printf("TIMESTAMP (milliSeconds): %lld\n", fbdo.to<uint64_t>());
    }

    float valToSend = calcAvgReading();
    float valToSendPerc = cmToPercentage(valToSend);

    Firebase.setFloat(fbdo, "/waterBottles/" +BOTTLE_ID +"/currentWaterVolume", valToSendPerc);
    lastSent = valToSend;
    Serial.print("Updating with val of: ");
    Serial.println(valToSendPerc);

    struct tm timeinfo;
    if(!getLocalTime(&timeinfo)){
      Serial.println("Failed to obtain time");
      return;
    }
    int todays_day = timeinfo.tm_mday;
    int todays_year = timeinfo.tm_year + 1900;
    int todays_month = timeinfo.tm_mon+1;
    String todays_day_str = String(todays_day);
    if(todays_day<10){
      todays_day_str = "0" + todays_day_str;
    }

    String todays_month_str = String(todays_month);
    if(todays_month<10){
      todays_month_str = "0" + todays_month_str;
    }

    String date_timestamp = String(todays_year) + todays_month_str + todays_day_str;
    //TODO: CODE
    bool got_data = Firebase.getString(fbdo,"waterBottles/"+BOTTLE_ID+"/todaysDate");
    if(!got_data){
      Firebase.setString(fbdo,"waterBottles/"+BOTTLE_ID+"/todaysDate", date_timestamp);
      Serial.print("Setting today's date to: ");
      Serial.print(date_timestamp);
    }
    else {
      String old_timestamp = fbdo.to<String>();
      if(!old_timestamp.equals(date_timestamp)){
        Serial.print("Updating today's date to: ");
        Serial.print(date_timestamp);
        Firebase.setString(fbdo,"waterBottles/"+BOTTLE_ID+"/todaysDate", date_timestamp);
      }
      else {
        Serial.println("Date is the same");
      }
    }

    taskCompleted = false;
  }
}