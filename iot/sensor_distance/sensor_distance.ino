#include <Wire.h>
#include <Adafruit_VL53L0X.h>

#define SDA_PIN 8
#define SCL_PIN 9

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Inicializa I2C nos pinos escolhidos
  Wire.begin(SDA_PIN, SCL_PIN);

  Serial.println("Iniciando VL53L0X...");

  if (!lox.begin()) {
    Serial.println("Falha ao detectar o VL53L0X :(");
    while (1);
  }

  Serial.println("VL53L0X iniciado com sucesso!");
}

void loop() {
  VL53L0X_RangingMeasurementData_t measure;

  lox.rangingTest(&measure, false); // false = sem debug

  if (measure.RangeStatus != 4) {  // 4 = erro de medição
    Serial.print("Distancia: ");
    Serial.print(measure.RangeMilliMeter);
    Serial.println(" mm");
  } else {
    Serial.println("Erro de leitura :(");
  }

  delay(500);
}
