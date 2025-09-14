import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Device } from "react-native-ble-plx";

export type UserData = {
  id: number;
  email: string;
  password: string;
}

export enum TypeSensor {
  IMPACT_SENSOR = "IMPACT_SENSOR",
  REAR_SENSOR = "REAR_SENSOR"
}

export type DeviceData = {
  id: number;
  user_id: number;
  bluetooth_name: string;
  service_uuid: string;
  characteristic_uuid: string;
  type: TypeSensor
  createdAt?: Date;
  updatedAt?: Date;
}


type RootStackParamList = {
  Scanner: undefined;
  SensorData: { BLUETOOTH_NAME: string, SERVICE_UUID: string, CHARACTERISTIC_UUID: string };
};

export type ScannerScreenProp = NativeStackNavigationProp<RootStackParamList, 'Scanner'>;