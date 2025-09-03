import qrcode
import json

esp_id = input("Digite o ID único ESP32 (ex: a8b2d08c): ")

# data = {
#     "SERVICE_UUID": "12345678-1234-1234-1234-1234567890ab",
#     "CHARACTERISTIC_UUID": "abcdef01-2345-6789-abcd-ef0123456789",
#     "IMPACT_BLUETOOTH_NAME": f"ESP32C3_{esp_id}",
#     "DISTANCE_BLUETOOTH_NAME": f"ESP32C3_{esp_id}",
# }
data = {
    "SERVICE_UUID": "12345678-1234-1234-1234-1234567890ab",
    "CHARACTERISTIC_UUID": "abcdef01-2345-6789-abcd-ef0123456789",
    "BLUETOOTH_NAME": f"ESP32C3_a8b2d08c",
}

json_data = json.dumps(data) # Converte para JSON
img = qrcode.make(json_data) # Gera QRCode
img.save("esp32_qrcode.png") # Salva QRCode em imagem

print("QRCode gerado com sucesso: esp32_qrcode.png")
