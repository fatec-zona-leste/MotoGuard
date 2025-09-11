import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QRCodeScreen from "../screens/qrcode-scanner";
import SensorData from "../screens/sensor-data";
import AddDevice from "../screens/add-device";
import Home from "../screens/home";

const Stack = createNativeStackNavigator();

export default function PrivateRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddDevice" component={AddDevice}/>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
      <Stack.Screen name="SensorData" component={SensorData} />
    </Stack.Navigator>
  );
}
