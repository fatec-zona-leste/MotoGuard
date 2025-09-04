// services/bluetooth.ts
import { BleManager, Device } from "react-native-ble-plx";
import { PERMISSIONS, requestMultiple, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from "buffer";

let connectedDevice: Device | null = null;
let connectedDeviceId: string | null = null;
const manager = new BleManager();

export async function connectToBluetooth(deviceName: string): Promise<Device> {
  if (connectedDevice) return connectedDevice;

  const state = await manager.state();
  if (state !== "PoweredOn") throw new Error("BLUETOOTH_OFF");

  return new Promise((resolve, reject) => {
    manager.stopDeviceScan();
    const timeoutId = setTimeout(() => {
      manager.stopDeviceScan();
      reject(new Error("DEVICE_NOT_FOUND"));
    }, 15000);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        clearTimeout(timeoutId);
        manager.stopDeviceScan();
        return reject(error);
      }

      if (device?.name === deviceName) {
        clearTimeout(timeoutId);
        manager.stopDeviceScan();
        device.connect()
          .then(d => d.discoverAllServicesAndCharacteristics())
          .then(async() => {
            connectedDevice = device;
            connectedDeviceId = device.id;
            await AsyncStorage.setItem('lastDeviceId', connectedDeviceId);
            resolve(device); // ← Retorna o device
          }) 
          .catch(reject);
      }
    });
  });
}

export async function disconnectBluetooth() {
  if (connectedDevice) {
    try {
      await manager.cancelDeviceConnection(connectedDevice.id);
      console.log("Dispositivo desconectado:", connectedDevice.id);
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    } finally {
      connectedDevice = null;
      connectedDeviceId = null;
      await AsyncStorage.removeItem('lastDeviceId');
    }
  }
}


export async function reconnect(): Promise<Device> {
  if (!connectedDeviceId) throw new Error("DEVICE_NOT_FOUND");

  try {
    const device = await manager.connectToDevice(connectedDeviceId);
    await device.discoverAllServicesAndCharacteristics();
    connectedDevice = device;
    return device;
  } catch (error) {
    throw new Error("FAILED_RECONNECT");
  }
}


export async function subscribeSensor(device: Device, serviceUUID: string, charUUID: string, callback: (value: string) => void) {
  // Aqui monitoramos a característica que o ESP32 está notificando
  device.monitorCharacteristicForService(serviceUUID, charUUID, (error, char) => {
    if (error) return console.error("BLE Monitor Error:", error);

    // Decodifica Base64
    const decoded = char?.value ? Buffer.from(char.value, 'base64').toString('utf-8') : '';
    callback(decoded);
  });
}

export function getConnectedDevice(): Device | null {
  return connectedDevice;
}

export async function requestBluetoothPermissions() {
  if (Platform.OS === "android") {
    const result = await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);

    return (
      result[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED &&
      result[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED &&
      result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
    );
  }
  return true;
}
