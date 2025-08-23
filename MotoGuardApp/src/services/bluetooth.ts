// services/bluetooth.ts
import { BleManager, Device } from "react-native-ble-plx";
import { PERMISSIONS, requestMultiple, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";

const manager = new BleManager(); // 🔑 singleton

export async function connectToBluetooth(deviceName: string): Promise<void> {
  const state = await manager.state();
  if (state !== "PoweredOn") {
    throw new Error("BLUETOOTH_OFF");
  }

  return new Promise((resolve, reject) => {
    manager.stopDeviceScan();

    const timeoutId = setTimeout(() => {
      manager.stopDeviceScan();
      reject(new Error("DEVICE_NOT_FOUND"));
    }, 15000);

    manager.startDeviceScan(null, null, (error, device: Device | null) => {
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
          .then(() => resolve())
          .catch(reject);
      }
    });
  });
}

export async function requestBluetoothPermissions() {
  if (Platform.OS === "android") {
    const result = await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);

    console.log("Permissões:", result);
    return (
      result[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED &&
      result[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED &&
      result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
    );
  }
  return true;
}
