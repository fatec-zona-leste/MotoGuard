import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/auth-context";
import PrivateRoutes from "./private-routes";
import PublicRoutes from "./public-routes";

export default function Routes() {
  const { signed } = useAuth();
  // const signed = true;

  return (
    <NavigationContainer>
        {signed ? <PrivateRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
}