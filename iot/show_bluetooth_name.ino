#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

void setup() {
  Serial.print("ESP32C3_");
  Serial.println(String((uint32_t)ESP.getEfuseMac(), HEX));
}

void loop() {}
