import qrcode
import json

esp_id = input("Digite o ID único ESP32 (ex: REAR_SENSOR_a9b2d08c): ")

data = {
    "BLUETOOTH_NAME": esp_id,
    "SERVICE_UUID": "12345678-1234-1234-1234-1234567890ab",
    "CHARACTERISTIC_UUID": "abcdef01-2345-6789-abcd-ef0123456789",
}

json_data = json.dumps(data) # Converte para JSON
img = qrcode.make(json_data) # Gera QRCode
img.save(f"{esp_id}.png") # Salva QRCode em imagem

print(f"QRCode gerado com sucesso: {esp_id}.png")
