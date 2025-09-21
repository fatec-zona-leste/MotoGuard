#include <Wire.h>
#include <Adafruit_VL53L0X.h>
#include <Adafruit_VL53L1X.h>
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

// Objetos dos dois sensores
Adafruit_VL53L0X lox0 = Adafruit_VL53L0X();
Adafruit_VL53L1X lox1 = Adafruit_VL53L1X();

bool usingVL53L0X = false;
bool usingVL53L1X = false;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);

  // Inicia I2C
  Wire.begin(SDA_PIN, SCL_PIN);

  // Primeiro tenta VL53L1X
  if (lox1.begin(0x29, &Wire)) {
    usingVL53L1X = true;
    lox1.startRanging();
    lox1.setTimingBudget(50);
    Serial.println("VL53L1X detectado.");
  } 
  // Se não encontrar, tenta VL53L0X
  else if (lox0.begin()) {
    usingVL53L0X = true;
    Serial.println("VL53L0X detectado.");
  } 
  else {
    Serial.println("Nenhum sensor VL53L0X/VL53L1X detectado!");
    while (true) {
      digitalWrite(LED_PIN, !digitalRead(LED_PIN));
      delay(1000);
    }
  }

  Serial.println("Sensor iniciado. Configurando BLE...");
  configureBLE(BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID);
}

void loop() {
  String data = "";

  if (usingVL53L1X) {
    // Mede com o VL53L1X
    int16_t dist = lox1.distance(); 
    int status = lox1.vl_status;

    if (status == 0) { // leitura válida
      data = String(dist);
    } else {
      Serial.print("Erro VL53L1X. Status: ");
      Serial.println(status);
    }
  } 
  else if (usingVL53L0X) {
    // Mede com o VL53L0X
    VL53L0X_RangingMeasurementData_t measure;
    lox0.rangingTest(&measure, false);
    if (measure.RangeStatus != 4) { // 4 = erro
      data = String(measure.RangeMilliMeter);
    } else {
      Serial.println("Erro de leitura VL53L0X");
    }
  }

  if (data.length() > 0) {
    pCharacteristic->setValue(data.c_str());
    pCharacteristic->notify();
    Serial.println("Dados enviados via BLE: " + data);
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }

  delay(100);
}
