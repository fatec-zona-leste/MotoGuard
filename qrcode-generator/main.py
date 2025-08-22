import qrcode
import uuid

# Gera um ID único para cada ESP
esp_id = str(uuid.uuid4())[:8]
bluetooth_name = "CAPACETE_BT"

# Cria payload em JSON
data = {
    "esp_id": esp_id,
    "bluetooth": bluetooth_name
}

# Gera QRCode
img = qrcode.make(data)

# Salva QRCode em imagem
img.save("esp32_qrcode.png")

print("QRCode gerado com sucesso: esp32_qrcode.png")
