import React, { useEffect } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/auth-context";
import PrivateRoutes from "./private-routes";
import PublicRoutes from "./public-routes";
import { Platform, StatusBar } from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Routes() {
  const { signed } = useAuth();
  // const signed = true;

  const MyTheme = { 
    ...DefaultTheme, 
    colors: {
      ...DefaultTheme.colors, 
      background: "#000",
    }
  };

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#1e1e1e');
      StatusBar.setTranslucent(true);
      changeNavigationBarColor("transparent", true); 
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={MyTheme}>
          {signed ? <PrivateRoutes /> : <PublicRoutes />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}