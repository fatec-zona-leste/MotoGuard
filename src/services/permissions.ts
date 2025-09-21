import { useCameraPermissions } from "expo-camera";
import { PermissionsAndroid, Platform } from "react-native";
import { PERMISSIONS, requestMultiple, RESULTS } from "react-native-permissions";

const requestNotificationPermission = async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    return true;
};

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

export async function requestAllPermissions(){
    return await requestNotificationPermission() && await requestBluetoothPermissions();
}