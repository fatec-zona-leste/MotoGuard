#include <WiFi.h>
#include <Wire.h>
#include <MPU9250_asukiaaa.h>

#define SDA_PIN 8
#define SCL_PIN 9
#define LED_PIN 5
#define ssid "IoT"
#define password "12345678"

float aX, aY, aZ, aSqrt; //Variáveis do acelerômetro 
bool impactDetected = false;
#define IMPACT_LIMIT 2.5  // Limite de aceleração para detectar impacto (em g)

MPU9250_asukiaaa mySensor;

void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    delay(1000);
  }
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  //while (!Serial);
  pinMode(LED_PIN, OUTPUT);

  initWiFi();
  digitalWrite(LED_PIN, HIGH);
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(100000); // 100 kHz para estabilidade
  mySensor.setWire(&Wire);

  // Inicializa acelerômetro e giroscópio
  mySensor.beginAccel();
  mySensor.beginGyro();

  Serial.println("Sensor iniciado. Aguardando dados...");
}

void loop() {
  // Atualiza acelerômetro
  if (mySensor.accelUpdate() == 0) {
    aX = mySensor.accelX();
    aY = mySensor.accelY();
    aZ = mySensor.accelZ();
    aSqrt = mySensor.accelSqrt();

    verifyImpact();
    if(impactDetected) blinkLED(800);
    else digitalWrite(LED_PIN, HIGH);

    Serial.printf("Accel -> X: %.2f Y: %.2f Z: %.2f | Magnitude: %.2f g\n", aX, aY, aZ, aSqrt);
  } else {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    Serial.println("Erro na leitura do acelerômetro");
  }

  delay(200);
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