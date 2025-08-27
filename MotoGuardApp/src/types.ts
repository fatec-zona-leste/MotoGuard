import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Device } from "react-native-ble-plx";

export type UserData = {
  email: string;
  password: string;
}

export type PrivateRoutesParamList = {
  QRCodeScreen: undefined;
  SensorData: undefined;
};

export type PublicRoutesParamList = {
  Login: undefined;
};


type RootStackParamList = {
  Scanner: undefined;
  SensorData: { BLUETOOTH_NAME: string, SERVICE_UUID: string, CHARACTERISTIC_UUID: string };
};

export type ScannerScreenProp = NativeStackNavigationProp<RootStackParamList, 'Scanner'>;