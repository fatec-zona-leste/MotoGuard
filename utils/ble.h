#ifndef BLE_H
#define BLE_H

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

extern BLEServer* pServer;
extern BLECharacteristic* pCharacteristic;

class MyServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
        Serial.println("Cliente conectado");
    }
    void onDisconnect(BLEServer* pServer) {
      Serial.println("Cliente desconectado");
      pServer->disconnect(pServer->getConnId());
      pServer->getAdvertising()->start(); 
    }
};


void configureBLE(String bluetoothName, const char* serviceUUID, const char* charUUID) {
  BLEDevice::init(bluetoothName);
  pServer = BLEDevice::createServer();
  
  BLEService *pService = pServer->createService(serviceUUID);
  pCharacteristic = pService->createCharacteristic(charUUID, BLECharacteristic::PROPERTY_NOTIFY);
  pCharacteristic->addDescriptor(new BLE2902());
  pServer->setCallbacks(new MyServerCallbacks());

  pService->start();
  
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(serviceUUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setName(bluetoothName);
  pAdvertising->start();

  Serial.println("BLE iniciado e anunciando: " + bluetoothName);
  Serial.println("SERVICE_UUID: " + String(serviceUUID));
  Serial.println("CHARACTERISTIC_UUID: " + String(charUUID));
}

#endif
