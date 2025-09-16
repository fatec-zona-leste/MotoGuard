import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QRCodeScreen from "../screens/qrcode-scanner";
import SensorData from "../screens/sensor-data";
import AddDevice from "../screens/add-device";
import Home from "../screens/home";
import SignupScreen from "../screens/register";
import Password from "../screens/password";
import EmergencyNum from "../screens/emergency-num";

const Stack = createNativeStackNavigator();

export default function PrivateRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="AddDevice" component={AddDevice}/>
      <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
      <Stack.Screen name="SensorData" component={SensorData} />
      <Stack.Screen name="Update" component={SignupScreen} />
      <Stack.Screen name="password" component={Password} />
      <Stack.Screen name="emergencyNum" component={EmergencyNum} />
    </Stack.Navigator>
  );
}
