#include "secrets.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"
 
// ESP32 pin number (36) which connects to AOUT pin of moisture sensor
#define AOUT_PIN 36

// Define IoT publish topic and port
#define AWS_IOT_PUBLISH_TOPIC "webar-soilmoisture"
#define AWS_IOT_PORT 8883 // for MQTTS

// Define the id of the plant the sensor is associated with
#define PLANT_ID 1

int moistureValue;
int moisturePercentage;

// WiFiClientSecure.h is a base class that provides Client SSL to ESP32 microcontroller
// https://github.com/espressif/arduino-esp32/blob/master/libraries/WiFiClientSecure/src/WiFiClientSecure.h
WiFiClientSecure wifiSecureNetwork = WiFiClientSecure();

// Create a pubsub client which uses WiFi connection with SSL encryption
PubSubClient pubsubClient(wifiSecureNetwork);

// Connect to AWS IoT Core using connection credentials 
void connectAWSIoTCore() {
  // Set ESP32 as a WiFi station
  WiFi.mode(WIFI_STA); 

  // Connect ESP32 to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD); 
  Serial.println("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
  // Configure WiFiClientSecure to use the AWS IoT device credentials
  wifiSecureNetwork.setCACert(AWS_CERT_CA);
  wifiSecureNetwork.setCertificate(AWS_CERT_CRT);
  wifiSecureNetwork.setPrivateKey(AWS_CERT_PRIVATE);
 
  // Connect to the MQTT broker on the AWS endpoint using pubsub client
  pubsubClient.setServer(AWS_IOT_ENDPOINT, AWS_IOT_PORT);
 
  // Create a message handler
  pubsubClient.setCallback(messageHandler);
 
  Serial.println("Connecting to AWS IOT");
 
  while (!pubsubClient.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }
 
  if (!pubsubClient.connected()) {
    Serial.println("AWS IoT Timeout!");
    return;
  }
 
  Serial.println("AWS IoT Connected!");
}

// Publish a JSON message to a IoT publish topic  
void publishMessage() {
  StaticJsonDocument<200> doc;
  doc["plantId"] = PLANT_ID;
  doc["moisturePercentage"] = moisturePercentage;
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client
 
  pubsubClient.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}
 
void messageHandler(char* topic, byte* payload, unsigned int length) {
  Serial.print("incoming: ");
  Serial.println(topic);
 
  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload);
  const char* message = doc["message"];
  Serial.println(message);
}
 
void setup() {
  // Open serial port with data rate = 115200 bits per sec
  Serial.begin(115200);
  connectAWSIoTCore();
}
 
void loop() {
  // Get moisture sensor reading from sensor
  moistureValue = analogRead(AOUT_PIN); 
  Serial.print("Moisture value: ");
  Serial.println(moistureValue);
  // Calculate moisture percentage
  moisturePercentage = (4095 - moistureValue) * 100 / 4095; // 4095 as observed is max value for DRY
  Serial.print("Moisture percentage: ");
  Serial.print(moisturePercentage);
  Serial.println("%");

  // Publish sensor reading to IoT Core every 5 seconds
  publishMessage();
  pubsubClient.loop(); // allow client to maintain its connection to IoT server
  delay(5000);
}