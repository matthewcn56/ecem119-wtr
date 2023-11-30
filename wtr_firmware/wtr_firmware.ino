#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include "secret.h"

// Provide the token generation process info.
#include <addons/TokenHelper.h>

// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>



const int trigPin = 22;
const int echoPin = 23;

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
float CM_DIFF_THRESHOLD = 1;
bool taskCompleted = false;
float SUSSY_THRESHOLD = 0.3;

float MAX_VOLUME = 1000;
float MAX_CM = 20.0;

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
  return (cm/MAX_CM);
}


//returns true if avg is past CM_DIFF_THRESHOLD and took at least PAST_READINGS_SIZE readings, false otherwise
bool determineUpdate(){
  if (valuesRead < PAST_READINGS_SIZE){
    return false;
  }
  float avgTotal = calcAvgReading();
  float readingDiff = avgTotal - lastSent;
  if(readingDiff > CM_DIFF_THRESHOLD || readingDiff<-CM_DIFF_THRESHOLD){
    // Serial.print("Should update with: ");
    // Serial.println(avgTotal);
    return true;
  }
  else {
    return false;
  }


}

void setup() {
  Serial.begin(115200); // Starts the serial communication
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  

  Serial.begin(115200);
  Serial.println();
  Serial.println();

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
  if(distanceCm >SUSSY_THRESHOLD){
    Serial.print("Distance (cm): ");
    Serial.println(distanceCm);
    addReading(distanceCm);
  }
}


void loop() {
  //read if READ_INTERVAL millis have passed
  if (millis() - lastReadTime > READ_INTERVAL){ 
    readDistance();
    lastReadTime = millis();
  }

  bool shouldUpdate = determineUpdate();
  

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

    taskCompleted = false;
  }
}