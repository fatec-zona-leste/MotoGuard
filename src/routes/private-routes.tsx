import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PrivateRoutesParamList } from "../types";
import QRCodeScreen from "../screens/qrcode-scanner";
import SensorData from "../screens/sensor-data";

const Stack = createNativeStackNavigator<PrivateRoutesParamList>();

export default function PrivateRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
      <Stack.Screen name="SensorData" component={SensorData} />
    </Stack.Navigator>
  );
}
