import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

import Button from "../components/button";
import DeviceCard from "../components/device";
import Header from "../components/header";
import Sensor from "../components/sensor";
import { DeviceData, TypeSensor } from "../types";
import { useAuth } from "../contexts/auth-context";
import { destroy, getDistanceSensor, index, sendAlert, verifyImpact } from "../services/sensor-service";
import { getErrorToast } from "../utils/error";
import { getDescriptionDevice, getNameDevice } from "../utils/device";
import Placeholder, { PlaceholderDeviceCard } from "../components/placeholder";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";
import { getConnectedDevice, safeReconnect, subscribeSensor } from "../services/bluetooth";
import { LogOut, Trash2, X } from "lucide-react-native";

type RootStackParamList = {
  AddDevice: undefined;
  QRCodeScreen: undefined;
  SensorData: { BLUETOOTH_NAME: string, SERVICE_UUID: string, CHARACTERISTIC_UUID: string, DEVICE_ID: number };
};

export default function WelcomeScreen({ route } : any) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [deleteMode, setDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
  const { token, logout, user } = useAuth();
  const [devices, setDevices] = useState<DeviceData[] | null>(null);
  const [distanceDevice, setDistanceDevice] = useState<DeviceData | null>(null);
  const [distanceValue, setDistanceValue] = useState<number | null>(null);
  const impactBlocked = useRef(false);

  useEffect(() => {
    try {
      if(user){
      const { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID, DEVICE_ID } = route?.params;
      
        const data: DeviceData = { 
          bluetooth_name: BLUETOOTH_NAME, 
          service_uuid: SERVICE_UUID, 
          characteristic_uuid: CHARACTERISTIC_UUID, 
          id: DEVICE_ID, 
          user_id: user.id, 
          type: TypeSensor.REAR_SENSOR
        }
        setDistanceDevice(data)
      }
    } catch (error) {
      
    }
  }, [user])

   const list = async () => {
    setLoading(true);
    if(!token) return;

    try {
        const response = await index(token);
        setDevices(response.data.devices);

        const distanceSensor = getDistanceSensor(response.data.devices);
        if(!distanceSensor) ToastNotification(ALERT_TYPE.WARNING, "Atenção", "Você não possui sensor de proximidade cadastrado");
        else ToastNotification(ALERT_TYPE.WARNING, "Atenção", "Conectando ao dispositivo");
        setDistanceDevice(distanceSensor);
        console.log(distanceSensor);
        
        
    } catch (error: any) {
        getErrorToast(error);
        console.error("Erro ao listar: " + error);
        console.error("Erro ao listar: " + error?.message);
    } finally {
      setLoading(false);
    }
  }

  const distanceSensor = (value: string) => {
      if (!impactBlocked.current) {
          setDistanceValue(Number(value));
          console.log(Number(value));
          
          impactBlocked.current = true;
      }
  }

  useEffect(() => {
    if(distanceDevice) connect(distanceDevice);
  }, [distanceDevice]);

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

  const connect = async (deviceParam: DeviceData) => {
    try {
      if(deviceParam.type.includes("REAR")){
        let device = getConnectedDevice();
        if (!device) {
            device = await safeReconnect(deviceParam.bluetooth_name); // passa o nome do dispositivo
        }

        device.onDisconnected((error, dev) => {
            getErrorToast({message: "DEVICE_DISCONNECTED"});
            return;
        });
        
        subscribeSensor(device, deviceParam.service_uuid, deviceParam.characteristic_uuid, (value) => {
            distanceSensor(value)
        });
        ToastNotification(ALERT_TYPE.SUCCESS, "Sucesso", "Dispositivo conectado");
        return;
      }

      const BLUETOOTH_NAME = deviceParam.bluetooth_name;
      const SERVICE_UUID = deviceParam.service_uuid;
      const CHARACTERISTIC_UUID = deviceParam.characteristic_uuid;
      const DEVICE_ID = deviceParam.id;
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
  }, [token]);

  return (
    <View style={styles.container}>
      <Header showBack={false} title="MotoGuard">
        {deleteMode && selectedDevice ? (
          <>
          <TouchableOpacity onPress={() => removeSelection()}>
            <Text >
              <X size={23} color={"#fff"}/>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => await remove()} >
            <Text >
              <Trash2 size={20} color={"#fff"}/>
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
        <Image
          source={require("../../assets/frontViewBike.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Sensor color={distanceValue && distanceValue < 200 ? "#DA4F4F" : undefined} width={150} height={35} />
        <Sensor color={distanceValue && distanceValue < 300 ? "#DA4F4F" : undefined} width={200} height={45} />
        <Sensor color={distanceValue && distanceValue < 500 ? "#DA4F4F" : undefined} width={250} height={55} />
      </View>

      {/* Rodapé com botões */}
      <View style={styles.footer}>

        <View style={styles.align}>
          {!loading && devices?.length && <Text style={styles.text}>Dispositivos Ativos:</Text>}
        </View>


        <PlaceholderDeviceCard loading={loading}/>

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

        <Button title="Adicionar Dispositivos" type="secondary" onPress={() => navigation.navigate("QRCodeScreen")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", // fundo escuro
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 60,
  },
  footer: {
    marginTop: "auto", // garante que fique no fim da tela
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 149,
    height: 137,
    marginBottom: 20,
  },
  text: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#fff",
  },
  align: {
    width: "100%",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
});
