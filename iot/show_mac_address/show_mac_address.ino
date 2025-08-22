#include "esp_bt_device.h"

void setup() {
  Serial.begin(115200);

  const uint8_t* point = esp_bt_dev_get_address();
  char macStr[18];
  sprintf(macStr, "%02X:%02X:%02X:%02X:%02X:%02X",
          point[0], point[1], point[2], point[3], point[4], point[5]);

  Serial.print("Bluetooth MAC Address: ");
  Serial.println(macStr);
}

void loop() {}
