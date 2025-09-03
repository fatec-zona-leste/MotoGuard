#include <Wire.h>
#include <Adafruit_VL53L0X.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include "../utils/ble.h"

#define SDA_PIN 8
#define SCL_PIN 9
#define LED_PIN 6

// UUIDs BLE
#define SERVICE_UUID        "12345678-1234-1234-1234-1234567890ab"
#define CHARACTERISTIC_UUID "abcdef02-2345-6789-abcd-ef0123456789"
String BLUETOOTH_NAME = "ESP32C3_" + String((uint32_t)ESP.getEfuseMac(), HEX);

BLEServer* pServer;
BLECharacteristic* pCharacteristic;

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);

  // Inicializa I2C nos pinos escolhidos
  Wire.begin(SDA_PIN, SCL_PIN);

  // delay(2000); //tempo para ver monitor serial 
  Serial.println("Iniciando VL53L0X...");

  if (!lox.begin()) {
    Serial.println("Falha ao detectar o VL53L0X");
    while (true) {
      digitalWrite(LED_PIN, !digitalRead(LED_PIN));
      delay(1000);
    };
  }

  Serial.println("Sensor iniciado. Configurando BLE...");
  digitalWrite(LED_PIN, HIGH);
  configureBLE(BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID);
}

void loop() {
  VL53L0X_RangingMeasurementData_t measure;

  lox.rangingTest(&measure, false); // false = sem debug

  if (measure.RangeStatus != 4) {  // 4 = erro de medição
    // Envia dados via BLE
    String data = String(measure.RangeMilliMeter);
    pCharacteristic->setValue(data.c_str());
    pCharacteristic->notify();
  } else {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    Serial.println("Erro de leitura");
  }

  delay(100);
}
