#include <Wire.h>
#include <MPU9250_asukiaaa.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SDA_PIN 8
#define SCL_PIN 9
#define LED_PIN 7

float aX, aY, aZ, aSqrt;
bool impactDetected = false;
#define IMPACT_LIMIT 2.5  // Limite de aceleração (em g)

MPU9250_asukiaaa mySensor;

// UUIDs BLE
#define SERVICE_UUID        "12345678-1234-1234-1234-1234567890ab"
#define CHARACTERISTIC_UUID "abcdef01-2345-6789-abcd-ef0123456789"
String BLUETOOTH_NAME = "ESP32C3_" + String((uint32_t)ESP.getEfuseMac(), HEX);

BLEServer* pServer;
BLECharacteristic* pCharacteristic;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);

  // Inicia I2C e sensor
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(100000);
  mySensor.setWire(&Wire);
  mySensor.beginAccel();
  mySensor.beginGyro();

  delay(2000);
  Serial.println("Sensor iniciado. Configurando BLE...");

  // Configura BLE
  BLEDevice::init(BLUETOOTH_NAME); // Nome único pelo MAC
  pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_NOTIFY
                    );
  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true); // 👈 importante
  pAdvertising->setName(BLUETOOTH_NAME); // 👈 importante
  pAdvertising->start();

  Serial.println("BLE iniciado e anunciando: " + BLUETOOTH_NAME);
  Serial.println("SERVICE_UUID: " + String(SERVICE_UUID));
  Serial.println("CHARACTERISTIC_UUID: " + String(CHARACTERISTIC_UUID));
}

void loop() {
  // Atualiza acelerômetro
  if (mySensor.accelUpdate() == 0) {
    aX = mySensor.accelX();
    aY = mySensor.accelY();
    aZ = mySensor.accelZ();
    aSqrt = mySensor.accelSqrt();

    //verifyImpact();
    
    digitalWrite(LED_PIN, HIGH);

    // Envia dados via BLE
    String data = String(aX) + "," + String(aY) + "," + String(aZ) + "," + String(aSqrt);
    pCharacteristic->setValue(data.c_str());
    pCharacteristic->notify();

    Serial.println("Dados enviados via BLE: " + data);
  } else {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    Serial.println("Erro na leitura do acelerômetro");
  }

  delay(100);
}

void verifyImpact(){
  if (aSqrt > IMPACT_LIMIT && !impactDetected) {
    Serial.println("IMPACTO DETECTADO!");
    impactDetected = true;
  } else {
    impactDetected = false;
  }
}

void blinkLED(int time){
  digitalWrite(LED_PIN, HIGH);
  delay(time);
  digitalWrite(LED_PIN, LOW);
  delay(time);
}
