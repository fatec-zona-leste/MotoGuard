import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PublicRoutesParamList } from "../types";
import Login from "../screens/login";

const Stack = createNativeStackNavigator<PublicRoutesParamList>();

export default function PublicRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}
