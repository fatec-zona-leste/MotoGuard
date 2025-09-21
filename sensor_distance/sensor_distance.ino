#include <Wire.h>
#include <Adafruit_VL53L0X.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include "../utils/ble.h"

#define SDA_PIN 8
#define SCL_PIN 9
#define LED_PIN 7

// UUIDs BLE
#define SERVICE_UUID        "12345678-1234-1234-1234-1234567890ab"
#define CHARACTERISTIC_UUID "abcdef01-2345-6789-abcd-ef0123456789"
String BLUETOOTH_NAME = "REAR_SENSOR_" + String((uint32_t)ESP.getEfuseMac(), HEX);

BLEServer* pServer;
BLECharacteristic* pCharacteristic;

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);

  // Inicia I2C e sensor
  Wire.begin(SDA_PIN, SCL_PIN);
  if (!lox.begin()) {
    Serial.println("Falha ao detectar o VL53L0X");
    while (true) {
      digitalWrite(LED_PIN, !digitalRead(LED_PIN));
      delay(1000);
    };
  }

  //delay(2000); //tempo para ver monitor serial 
  Serial.println("Sensor iniciado. Configurando BLE...");
  configureBLE(BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID);
}

void loop() {
  VL53L0X_RangingMeasurementData_t measure;

  lox.rangingTest(&measure, false); // false = sem debug
  digitalWrite(LED_PIN, HIGH);

  //measure.RangeStatus != 4 // 4 = erro de medição
  if (true) {
    // Envia dados via BLE
    String data = String(measure.RangeMilliMeter);
    pCharacteristic->setValue(data.c_str());
    pCharacteristic->notify();

    Serial.println("Dados enviados via BLE: " + data);
  } else {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    Serial.println("Erro de leitura");
  }

  delay(100);
}
