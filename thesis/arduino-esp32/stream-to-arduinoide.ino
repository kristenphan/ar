#include <WiFi.h>

// Wifi network name and password
const char* ssid = "KristenP";
const char* password = "38289149";

// ESP32 pin GIOP36 (ADC0) that connects to AOUT pin of moisture sensor
#define AOUT_PIN 36

void setup() {
  // Open serial port with data rate = 9600 bits per sec
  Serial.begin(9600);
  // Connect to wifi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConnected to WiFi network");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if ((WiFi.status() == WL_CONNECTED)) { // Check wifi connection
    Serial.print("You can try to ping me at ");
    Serial.println(WiFi.localIP());

    // Print soil moisture reading
    int moistureValue = analogRead(AOUT_PIN); // read the analog value from sensor
    Serial.print("Moisture value: ");
    Serial.println(moistureValue);
    int moisturePercentage = (4095 - moistureValue) * 100 / 4095; // 4095 as observed is max value for DRY
    Serial.print("Moisture percentage: ");
    Serial.print(moisturePercentage);
    Serial.println("%");

    delay(5000); // Get new sensor reading every 5 secs
  }
  else {
    Serial.println("Connection lost");
  }
}