import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PublicRoutesParamList } from "../types";
import Login from "../screens/login";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import WelcomeScreen from "../screens/welcome-screen";
import SignupScreen from "../screens/register";
import Password from "../screens/password";
import EmergencyNum from "../screens/emergency-num";

const Stack = createNativeStackNavigator();

export default function PublicRoutes() {
  return (
      <Stack.Navigator
        initialRouteName="welcomeScreen"
        screenOptions={{
          headerShown: false,
          animation: "none",
          // stackPresentation: "card",
          contentStyle: { backgroundColor: "#1e1e1e" },
          keyboardHandlingEnabled: false, // ⚡ aplica em todas as telas
        }}
      >
        <Stack.Screen
          name="welcomeScreen"
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="register"
          component={SignupScreen}
          
        />
        <Stack.Screen
          name="login"
          component={Login}
        />
        <Stack.Screen
          name="password"
          component={Password}
        />
        <Stack.Screen
          name="emergencyNum"
          component={EmergencyNum}
        />
      </Stack.Navigator>
    // <Stack.Navigator screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="Login" component={Login} />
    // </Stack.Navigator>
  );
}
