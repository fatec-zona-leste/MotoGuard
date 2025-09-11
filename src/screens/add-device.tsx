import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaskedTextInput } from "react-native-mask-text";

import Button from "../components/button";
import Header from "../components/header";
import DeviceCard from "../components/device";
import { DeviceData } from "../types";
import { destroy, index } from "../services/sensor-service";
import { useAuth } from "../contexts/auth-context";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";
import { getErrorToast } from "../utils/error";
import { getDescriptionDevice, getNameDevice } from "../utils/device";
import { connectToBluetooth } from "../services/bluetooth";
import { LogOut, Trash2, X } from "lucide-react-native";

export default function AddDevice() {
  const [loading, setLoading] = useState(true);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [devices, setDevices] = useState<DeviceData[] | null>(null);
  const navigation = useNavigation<any>();
  const { token, logout } = useAuth();
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);

  const list = async () => {
    setLoading(true);
    if(!token) return;

    try {
        const response = await index(token);
        setDevices(response.data.devices);
    } catch (error: any) {
        getErrorToast(error);
        console.error("Erro ao listar: " + error);
        console.error("Erro ao listar: " + error?.message);
    } finally {
      setLoading(false);
    }
  }

  const remove = async () => {
    setLoadingConnection(true);
    if(!token || !selectedDevice) return;

    try {
      await destroy(token, selectedDevice?.id);
      await list();
    } catch (error) {
      getErrorToast(error);
      console.error("Erro ao apagar:", error);
    } finally {
      setDeleteMode(false);
      setSelectedDevice(null);
      setLoadingConnection(false);
    }
  }

  const connect = async (device: DeviceData) => {
    try {
      const BLUETOOTH_NAME = device.bluetooth_name;
      const SERVICE_UUID = device.service_uuid;
      const CHARACTERISTIC_UUID = device.characteristic_uuid;
      const DEVICE_ID = device.id;
      navigation.navigate("SensorData", { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID, DEVICE_ID });

    } catch (error: any) {
      getErrorToast(error);
      console.error("Erro ao conectar:", error);
    } finally {
      setLoadingConnection(false);
    }
  }

  const removeSelection = () => {
    setDeleteMode(true);
    setSelectedDevice(null);
  }

  useEffect(() => {
    list();
  }, [token])

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Header showBack={false} title="MotoGuard">
        {deleteMode && selectedDevice ? (
          <>
          <TouchableOpacity onPress={async () => await remove()} >
            <Text >
              <Trash2 size={20} color={"#fff"}/>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => removeSelection()}>
            <Text >
              <X size={23} color={"#fff"}/>
            </Text>
          </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => logout()} >
            <Text >
              <LogOut size={20} color={"#fff"}/>
            </Text>
          </TouchableOpacity>
        )}
      </Header>

      {/* Conteúdo central */}
      <View style={styles.content}>
        {devices?.map((device, index) => (
          <DeviceCard
            setelected={device.id === selectedDevice?.id}
            key={index}
            imageSource={require("../../assets/moto.png")}
            title={getNameDevice(device.type)}
            description={getDescriptionDevice(device.type)}
            onPress={async () => { 
              if(deleteMode && device.id !== selectedDevice?.id)return  setSelectedDevice(device);
              if (device.id === selectedDevice?.id) return removeSelection(); 
              await connect(device); 
            }}
            onLongPress={() => {
              setDeleteMode(true);
              setSelectedDevice(device);
            }}
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