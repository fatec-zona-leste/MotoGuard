import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

// Função para conectar ao ESP32
export async function connectToBluetooth(deviceName: string): Promise<void> {
  try {
    // Lista dispositivos emparelhados
    const devices: BluetoothDevice[] = await RNBluetoothClassic.getBondedDevices();

    const device = devices.find(d => d.name === deviceName);

    if (!device) {
      console.log('Dispositivo não encontrado');
      return;
    }

    // Conecta
    const connected: boolean = await device.connect();
    console.log('Conectado?', connected);

    // Receber dados
    device.onDataReceived((data: { data: string }) => {
      console.log('Recebido:', data.data);
    });

    // Enviar dados
    await device.write('Olá ESP32\n');

  } catch (error) {
    throw error;
  }
}
