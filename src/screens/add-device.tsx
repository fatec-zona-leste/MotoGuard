import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaskedTextInput } from "react-native-mask-text";

import Button from "../components/button";
import Header from "../components/header";
import DeviceCard from "../components/device";
import { DeviceData } from "../types";
import { index } from "../services/sensor-service";
import { useAuth } from "../contexts/auth-context";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";
import { getErrorToast } from "../utils/error";
import { getDescriptionDevice, getNameDevice } from "../utils/device";
import { connectToBluetooth } from "../services/bluetooth";

export default function AddDevice() {
  const [loading, setLoading] = useState(true);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [devices, setDevices] = useState<DeviceData[] | null>(null);
  const navigation = useNavigation<any>();
  const { token } = useAuth();

  const list = async () => {
    setLoading(true);
    if(!token) return;

    try {
        const response = await index(token);
        console.log(response);
        
        setDevices(response.data.devices);
    } catch (error) {
        getErrorToast(error);
        console.error("Erro ao listar: " + error);
    } finally {
      setLoading(false);
    }
  }

  const connect = async (device: DeviceData) => {
    try {
      setLoadingConnection(true);
      const connected = await connectToBluetooth(device.bluetooth_name);

      ToastNotification(ALERT_TYPE.SUCCESS, "Dispositivo conectado", `Conectado: ${device.bluetooth_name}`);
      console.log("Dispositivo conectado:", connected.id);
    } catch (error: any) {
      getErrorToast(error);
      console.error("Erro ao conectar:", error);
    } finally {
      setLoadingConnection(false);
    }
  }

  useEffect(() => {
    list();
  }, [token])

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Header title="MotoGuard" />

      {/* Conteúdo central */}
      <View style={styles.content}>
        {devices?.map((device, index) => (
          <DeviceCard
          key={index}
          imageSource={require("../../assets/moto.png")}
          title={getNameDevice(device.type)}
          description={getDescriptionDevice(device.type)}
          onPress={async () => { await connect(device); }}
          />
        ))}
       
       <View style={{ marginTop: 20 }}>
        {loading || loadingConnection ? ( 
            <ActivityIndicator color={"#fff"} />
        ) : null}
       </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Adicionar"
          onPress={() => navigation.navigate("QRCodeScreen")}
        />
        {/* <Button
          title="Agora não"
          type="secondary"
          onPress={() => navigation.navigate("Home")}
        /> */}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 60,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  footerLink: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});