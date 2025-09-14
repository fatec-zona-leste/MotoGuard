// services/bluetooth.ts
import { BleManager, Device } from "react-native-ble-plx";
import { PERMISSIONS, requestMultiple, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from "buffer";

let connectedDevices: Record<string, Device> = {}; // chave = id

let connectedDeviceId: string | null = null;
let connectedDevicesId: Record<string, string> = {}; // chave = id

const manager = new BleManager();

export async function connectToBluetooth(deviceName: string): Promise<Device> {
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
          .then(async () => {
            connectedDevices[device.id] = device; // salva vários
            await AsyncStorage.setItem(`lastDeviceId:${deviceName}`, device.id);
            resolve(device);
          })
          .catch(reject);
      }
    });
  });
}

export async function disconnectBluetooth(deviceId: string) {
  const device = connectedDevices[deviceId];
  if (device) {
    try {
      await manager.cancelDeviceConnection(device.id);
      console.log("Dispositivo desconectado:", device.id);
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    } finally {
      delete connectedDevices[deviceId];
      await AsyncStorage.removeItem(`lastDeviceId:${device.id}`);
    }
  }
}


export async function reconnect(deviceName: string): Promise<Device> {
  const state = await manager.state();
  if (state !== "PoweredOn") throw new Error("BLUETOOTH_OFF");

  const savedId = await AsyncStorage.getItem(`lastDeviceId:${deviceName}`);

  if (savedId) {
    try {
      const device = await manager.connectToDevice(savedId);
      await device.discoverAllServicesAndCharacteristics();
      connectedDevices[device.id] = device;
      return device;
    } catch (error) {
      console.warn("Falha ao reconectar pelo ID, tentando scan...");
      await AsyncStorage.removeItem(`lastDeviceId:${deviceName}`);
    }
  }

  return new Promise((resolve, reject) => {
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
          .then(async () => {
            connectedDevices[device.id] = device;
            await AsyncStorage.setItem(`lastDeviceId:${deviceName}`, device.id);
            resolve(device);
          })
          .catch(reject);
      }
    });
  });
}

export async function safeReconnect(deviceName: string): Promise<Device> {
  const existing = Object.values(connectedDevices).find(d => d.name === deviceName);
  if (existing) {
    try {
      await manager.cancelDeviceConnection(existing.id);
    } catch (e) {
      console.warn("Não conseguiu cancelar conexão anterior:", e);
    }
    delete connectedDevices[existing.id];
  }
  return reconnect(deviceName);
}



// export async function subscribeSensor(device: Device, serviceUUID: string, charUUID: string, callback: (value: string) => void) {
//   // Aqui monitoramos a característica que o ESP32 está notificando
//   device.monitorCharacteristicForService(serviceUUID, charUUID, (error, char) => {
//     // if (error) return console.error("BLE Monitor Error:", error);
//     if (error) throw error;

//     // Decodifica Base64
//     const decoded = char?.value ? Buffer.from(char.value, 'base64').toString('utf-8') : '';
//     callback(decoded);
//   });
// }

export async function subscribeSensor(
  deviceName: string,
  serviceUUID: string,
  characteristicUUID: string,
  callback: (value: string) => void
) {
  const device = getConnectedDeviceByName(deviceName); // ✅ busca o correto
  if (!device) throw new Error(`Dispositivo ${deviceName} não está conectado`);

  return device.monitorCharacteristicForService(
    serviceUUID,
    characteristicUUID,
    (error, characteristic) => {
      if (error) {
        console.error("Erro no monitoramento:", error);
        if (error) throw error;
        return;
      }
      if (characteristic?.value) {
        const raw = Buffer.from(characteristic.value, "base64").toString("utf-8");
        const parsed = raw // ou parseFloat se for decimal
        callback(parsed);
      }
    }
  );
}


export function getConnectedDevice(deviceId: string): Device | null {
  return connectedDevices[deviceId] || null;
}

export function getConnectedDeviceByName(name: string): Device | null {
  return Object.values(connectedDevices).find(d => d.name === name) || null;
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
