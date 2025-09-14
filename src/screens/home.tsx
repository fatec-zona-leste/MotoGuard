import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Vibration, TouchableOpacity, Alert } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Button from "../components/button";
import DeviceCard from "../components/device";
import Header from "../components/header";
import Sensor from "../components/sensor";
import { DeviceData, TypeSensor } from "../types";
import { useAuth } from "../contexts/auth-context";
import { destroy, getDistanceSensor, getImpactSensor, index, sendAlert, verifyImpact } from "../services/sensor-service";
import { getErrorToast } from "../utils/error";
import { getDescriptionDevice, getNameDevice } from "../utils/device";
import Placeholder, { PlaceholderDeviceCard } from "../components/placeholder";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";
import { getConnectedDevice, safeReconnect, subscribeSensor } from "../services/bluetooth";
import { LocateOff, LogOut, Trash2, X } from "lucide-react-native";
import { LIMIT_REAR_SENSOR, SENSITIVY_VALUE } from "../utils/vars";

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
  const [selectedDevice, setSelectedDevice] = useState<DeviceData[] | null>(null);
  const { token, logout, user } = useAuth();
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [distanceDevice, setDistanceDevice] = useState<DeviceData | null>(null);
  const [distanceValue, setDistanceValue] = useState<number | null>(null);
  const impactBlocked = useRef(false);
  const [connectedDevicesState, setConnectedDevicesState] = useState<Record<string, boolean>>({});

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
        setDistanceDevice(distanceSensor);
    } catch (error: any) {
        getErrorToast(error);
        console.error("Erro ao listar: " + error);
        console.error("Erro ao listar: " + error?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
      console.log(connectedDevicesState);
      
    }, [connectedDevicesState])

  const impactSensor = async (value: string) => {
      const parts = value.split(",");
      const aSqrt = parseFloat(parts[3] || "0");
      const currentDevice = getImpactSensor(devices);

      const alertTriggered = await verifyImpact(aSqrt, SENSITIVY_VALUE);

      if (alertTriggered && !impactBlocked.current) {
          impactBlocked.current = true;
          ToastNotification(ALERT_TYPE.WARNING, "Impacto de detectado", "Enviando alerta de contato de emergência");
          if(currentDevice) await sendAlert(token, currentDevice.id);
          impactBlocked.current = false;
          return;
      }
  }
  
  const distanceSensor = (value: string) => {
    setDistanceValue(Number(value));

    if(Number(value) <= LIMIT_REAR_SENSOR){
      Vibration.vibrate(1000);
    }
  }

  useEffect(() => {
    if (devices?.length) {
      devices.forEach((device) => {
        if (!device.bluetooth_name.includes("MOCK")) {
          connectAndSubscribe(device);
        }
      });
    }
  }, [devices]);


  // useEffect(() => {
  //   if(distanceDevice) connect(distanceDevice);
  // }, [distanceDevice]);

  const remove = async () => {
    setLoadingConnection(true);
    if(!token || !selectedDevice) return;

    try {
      selectedDevice.map(async(d) => {
        await destroy(token, d?.id);
      });
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

  const confirmDelet = () => {
     Alert.alert('Confirmar exclusão?', `Deseja apagar ${selectedDevice?.length} sensor${selectedDevice?.length ? "es" : ""}`, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {text: 'Apagar', onPress: async() => await remove()},
    ]);
  }

  const subscriptionsRef = useRef<Record<string, any>>({}); // chave = deviceName

  const connectAndSubscribe = async (deviceParam: DeviceData) => {
    try {
      let device = getConnectedDevice(String(deviceParam.id));
      if (!device) {
        device = await safeReconnect(deviceParam.bluetooth_name);
      }

      if (!(await device.isConnected())) throw new Error("DEVICE_NOT_CONNECTED");

      // remove subscription antiga, se houver
      if (subscriptionsRef.current[deviceParam.bluetooth_name]) {
        subscriptionsRef.current[deviceParam.bluetooth_name].remove();
      }

      const sub = await subscribeSensor(deviceParam.bluetooth_name, deviceParam.service_uuid, deviceParam.characteristic_uuid, (value) => {
          try {
            if (deviceParam.type.includes("IMPACT")) return impactSensor(value);
            return distanceSensor(value);
          } catch (error) {
            console.log("viciiiii");
            
          }
        }
      );

      subscriptionsRef.current[deviceParam.bluetooth_name] = sub;

      ToastNotification(ALERT_TYPE.SUCCESS, "Sucesso", `${getNameDevice(deviceParam.type)} conectado`);
      setConnectedDevicesState(prev => ({ ...prev, [deviceParam.id]: true }));
    } catch (error) {
      setConnectedDevicesState(prev => ({ ...prev, [deviceParam.id]: false }));
      getErrorToast(error);
      console.error("Erro ao conectar:", error);
    }
  };


  const connect = async (deviceParam: DeviceData, isClick: boolean = false) => {
    try {
      ToastNotification(ALERT_TYPE.WARNING, "Atenção", "Conectando ao dispositivo");

      if(deviceParam.bluetooth_name.includes("MOCK") && isClick){
        const BLUETOOTH_NAME = deviceParam.bluetooth_name;
        const SERVICE_UUID = deviceParam.service_uuid;
        const CHARACTERISTIC_UUID = deviceParam.characteristic_uuid;
        const DEVICE_ID = deviceParam.id;
        navigation.navigate("SensorData", { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID, DEVICE_ID });
        return;
      }

      if(deviceParam.bluetooth_name.includes("MOCK")) return ToastNotification(ALERT_TYPE.SUCCESS, "Sucesso", "Dispositivo mock conectado");

      let device = getConnectedDevice(String(deviceParam.id));
      if (!device) {
        device = await safeReconnect(deviceParam.bluetooth_name);
      }


      if (!(await device.isConnected())) {
        throw new Error("DEVICE_NOT_CONNECTED");
      }

      device.onDisconnected((error, dev) => {
          setConnectedDevicesState(prev => ({ ...prev, [deviceParam.id]: false }));
          getErrorToast({message: "DEVICE_DISCONNECTED"});
          return;
      });
      
      subscribeSensor(deviceParam.bluetooth_name, deviceParam.service_uuid, deviceParam.characteristic_uuid, (value) => {
        if(deviceParam.type.includes("IMPACT"))
          return impactSensor(value);

        return distanceSensor(value);
      });
      
      ToastNotification(ALERT_TYPE.SUCCESS, "Sucesso", "Dispositivo conectado");
      setConnectedDevicesState(prev => ({ ...prev, [deviceParam.id]: true }));
    } catch (error: any) {
      setConnectedDevicesState(prev => ({ ...prev, [deviceParam.id]: false }));
      getErrorToast(error);
      console.error("Erro ao conectar:", error);
    } finally {
      setLoadingConnection(false);
    }
  }

  const removeSelection = () => {
    setSelectedDevice([]);
  }
  
  useEffect(() => {
    list();
  }, [token]);

  return (
    <View style={styles.container}>
      <Header showBack={false} title="MotoGuard">
        {selectedDevice?.length ? (
          <>
          <TouchableOpacity onPress={() => removeSelection()}>
            <Text >
              <X size={23} color={"#fff"}/>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelet} >
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
        {!distanceDevice ? (
          <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, marginTop: -50 }}>
            <LocateOff size={100} color="#9d9c9cff"/>
            <Text style={{ color: "#fff", marginTop: 20, fontSize: 15, opacity: .8 }}>Nenhum sensor de distância cadastrado</Text>
          </View>
        ) : (
          <>
            <Image
              source={require("../../assets/frontViewBike.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Sensor color={distanceValue && distanceValue < 200 ? "#DA4F4F" : undefined} width={150} height={35} />
            <Sensor color={distanceValue && distanceValue < 300 ? "#DA4F4F" : undefined} width={200} height={45} />
            <Sensor color={distanceValue && distanceValue < 500 ? "#DA4F4F" : undefined} width={250} height={55} />
          </>
        )}

      </View>

      {/* Rodapé com botões */}
      <View style={styles.footer}>

        <View style={styles.align}>
          {!loading && devices?.length && <Text style={styles.text}>Dispositivos Ativos:</Text>}
        </View>


        <PlaceholderDeviceCard loading={loading}/>

        {devices?.map((device, index) => (
          <DeviceCard
            connected={!!connectedDevicesState[device.id]} 
            setelected={selectedDevice?.some(d => d.id === device.id)}
            key={index}
            imageSource={require("../../assets/moto.png")}
            title={getNameDevice(device.type)}
            description={getDescriptionDevice(device.type)}
            onPress={async () => { 
              if(selectedDevice?.length && !selectedDevice?.some(d => d.id === device.id)){
                setSelectedDevice(prev => prev ? [...prev, device] : [device]);
                return;
              }

              if (selectedDevice?.some(d => d.id === device.id)){ 
                setSelectedDevice(prev => prev?.filter(d => d.id !== device.id) ?? []);
                setDeleteMode(false);
                return
              }; 

              await connect(device, true); 
            }}
            onLongPress={() => {
              setSelectedDevice(prev => prev ? [...prev, device] : [device]);
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
