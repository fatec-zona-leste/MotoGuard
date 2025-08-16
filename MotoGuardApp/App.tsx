// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./src/routes/AuthStack";

export default function App() {
  const isAuthenticated = false; // Aqui você vai usar seu contexto ou Redux

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthStack /> : <AuthStack />}
    </NavigationContainer>
  );
}