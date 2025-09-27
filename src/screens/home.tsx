import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Vibration, TouchableOpacity, Alert, DrawerLayoutAndroid, NativeModules, DeviceEventEmitter, Platform  } from "react-native";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
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
import { KeyRound, LocateOff, LogOut, LogOutIcon, Menu, Pencil, Phone, Trash2, X } from "lucide-react-native";
import { LIMIT_REAR_SENSOR, SENSITIVY_VALUE, WAITING_TIME_SENDING_ALERT_DISTANCE, WAITING_TIME_SENDING_ALERT_IMPACT } from "../utils/vars";
// import PipHandler from "react-native-pip-android";
// import enterPictureInPictureMode from "react-native-pip-android";
import PushNotification from "react-native-push-notification";
import { requestAllPermissions } from "../services/permissions";
import * as Speech from "expo-speech";

type RootStackParamList = {
  AddDevice: undefined;
  QRCodeScreen: undefined;
  Update: undefined;
  emergencyNum: undefined;
  password: undefined;
  SensorData: { BLUETOOTH_NAME: string, SERVICE_UUID: string, CHARACTERISTIC_UUID: string, DEVICE_ID: number };
};

export default function WelcomeScreen({ route } : any) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [deleteMode, setDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData[] | null>(null);
  const { token, logout, user, deleteAccount } = useAuth();
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [impactDevice, setImpactDevice] = useState<DeviceData | null>(null);
  const [distanceDevice, setDistanceDevice] = useState<DeviceData | null>(null);
  const [distanceValue, setDistanceValue] = useState<number | null>(null);
  const impactBlocked = useRef(false);
  const [connectedDevicesState, setConnectedDevicesState] = useState<Record<string, boolean>>({});
  const drawer = useRef<DrawerLayoutAndroid>(null);
  const { PipModule } = NativeModules;
  const [inPiP, setInPiP] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionsRef = useRef<Record<string, any>>({}); // chave = deviceName
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const lastNotificationDistanceTimeRef = useRef<number>(0); // armazena timestamp da última notificação

  useFocusEffect(
    useCallback(() => {
      // Sempre que a tela ganhar foco
      if (drawer.current) {
        drawer.current.closeDrawer(); // garante que fecha ao voltar
      }

      return () => {
        // cleanup se precisar
      };
    }, [])
  );

  useEffect(() => {
    const checkPermissions = async () => {
      const granted = await requestAllPermissions();
      setPermissionsGranted(granted);

      if (!granted) {
        // ToastNotification(ALERT_TYPE.DANGER, "Permissões necessárias", "Ative as permissões para conectar ao dispositivo");
      }
    };

    checkPermissions();
  }, []);

  const enterPiPMode = () => {
    setInPiP(true);
    PipModule.setAspectRatio(1.0);
    PipModule.enterPipMode();
  };

  useEffect(() => {
    const checkPiP = async () => {
      if (PipModule?.isInPipMode) {
        const result = await PipModule.isInPipMode();
        setInPiP(result);
      }
    };

    checkPiP();

    // opcional: verificar periodicamente
    const interval = setInterval(checkPiP, 1000);
    return () => clearInterval(interval);
  }, []);

  const confirmLogout = () => {
    Alert.alert('Sair da conta?', ``, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {text: 'Sair', onPress: logout},
    ]);
  }

  const confirmDeleteAccount = () => {
    Alert.alert('Tem certeza que deseja apagar a conta?', `Não é possível recuperar os dados`, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {text: 'Apagar', onPress: () => {if(token) deleteAccount(token)}},
    ]);
  }

  // useEffect(() => {
  //   try {
  //     if(user){
  //     const { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID, DEVICE_ID } = route?.params;
      
  //       const data: DeviceData = { 
  //         bluetooth_name: BLUETOOTH_NAME, 
  //         service_uuid: SERVICE_UUID, 
  //         characteristic_uuid: CHARACTERISTIC_UUID, 
  //         id: DEVICE_ID, 
  //         user_id: user.id, 
  //         type: TypeSensor.REAR_SENSOR
  //       }
  //       setDistanceDevice(data)
  //     }
  //   } catch (error) {
      
  //   }
  // }, [user])

   const list = async () => {
    setLoading(true);
    if(!token) return;

    try {
        const response = await index(token);
        setDevices(response.data.devices);
        setImpactDevice(getImpactSensor(response.data.devices));
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
      PushNotification.createChannel(
        {
          channelId: "default-channel-id",
          channelName: "Notificações padrão",
          playSound: false,
          vibrate: false,
        },
        (created) => console.log(`Canal criado: ${created}`)
      );

      PushNotification.configure({
        onNotification: function (notification) {
          console.log("📩 Notificação recebida:", notification);
        },
        requestPermissions: Platform.OS === "ios",
      });
    }, []);


  // configure uma vez na inicialização do app
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("Notificação clicada:", notification);

      if (notification.id === "1") {
        ToastNotification(ALERT_TYPE.SUCCESS, "Alerta cancelado", "O envio para o contato de emergência foi cancelado");
        // Cancela timeout
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        // Cancela intervalo
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }

        // Remove notificação
        PushNotification.cancelLocalNotification("1");

        impactBlocked.current = false;
      }
    },
    requestPermissions: Platform.OS === "ios",
  });

  const speakAlert = (message: string) => {
    Speech.speak(message, {
      language: "pt-BR", // voz em português
      rate: 1.0, // velocidade normal
      pitch: 1.0, // tom normal
    });
  };
  
  const impactSensor = async (value: string) => {
    const parts = value.split(",");
    const aSqrt = parseFloat(parts[3] || "0");
    const alertTriggered = await verifyImpact(aSqrt, SENSITIVY_VALUE);

    if (alertTriggered && !impactBlocked.current) {
      impactBlocked.current = true;

      let counter = 10;
      intervalIdRef.current = null;

      // Cria a notificação inicial
      PushNotification.localNotification({
        channelId: "default-channel-id",
        id: "1", // string! mais confiável
        title: "Alerta de impacto!",
        message: `O alerta será enviado em ${counter} segundos. Toque para cancelar.`,
        tag: "impact-alert", // garante substituição
        playSound: false,
        soundName: "default",
      });
      speakAlert(`Alerta de impacto! O alerta será enviado em ${counter} segundos. Toque para cancelar`);

      // Atualiza contagem regressiva
      intervalIdRef.current = setInterval(() => {
        counter--;
        if (counter > 0) {
          PushNotification.localNotification({
            channelId: "default-channel-id",
            id: "1",
            title: "Alerta de impacto!",
            message: `O alerta será enviado em ${counter} segundos. Toque para cancelar.`,
            tag: "impact-alert",
            playSound: false,
            soundName: undefined,
            vibrate: false,
          });
        } else {
          clearInterval(intervalIdRef.current!);
        }
      }, 1000);

      // Agenda envio real
      timeoutIdRef.current = setTimeout(async () => {

        clearInterval(intervalIdRef.current!);
         PushNotification.localNotification({
            channelId: "default-channel-id",
            id: "1",
            title: "Alerta de impacto!",
            message: `O alerta de impacto foi enviado para seu contato de emergência.`,
            tag: "impact-alert",
            playSound: false,
            soundName: undefined,
            vibrate: false,
          });

        if (impactDevice) await sendAlert(token, impactDevice.id);
        // if (impactDevice) ToastNotification(ALERT_TYPE.DANGER, "ALERTA ENVIADO", `ALERTA ENVIADO`); //local
        impactBlocked.current = false;
      }, WAITING_TIME_SENDING_ALERT_IMPACT);
    }
  };
  
  const distanceSensor = (value: string) => {
    setDistanceValue(Number(value));
    console.log(Number(value));
    const now = Date.now();
    
    if(Number(value) > 0 && Number(value) <= LIMIT_REAR_SENSOR){
      Vibration.vibrate(1000);
      if(now - lastNotificationDistanceTimeRef.current >= WAITING_TIME_SENDING_ALERT_DISTANCE){
        // const beep = new Sound('audio.m4a', Sound.MAIN_BUNDLE, (error) => {
        //   if (!error) {
        //     beep.play();
        //   } else {
        //     console.log('Erro ao carregar o som:', error);
        //   }
        // });

        // // AUDIO
        // beep.stop(() => {
        //   beep.play();
        // });

        lastNotificationDistanceTimeRef.current = now;
        PushNotification.localNotification({
          channelId: "default-channel-id",
          title: "Atenção!",
          message: "Atenção! Obstáculo muito próximo!",
        });
      }
    }
  }

  // useEffect(() => {
  //   if (devices?.length) {
  //     devices.forEach((device) => {
  //       if (!device.bluetooth_name.includes("MOCK") && !connectedDevicesState[device.id]) {
  //         connectDevice(device);
  //       }
  //     });
  //   }
  // }, [devices]);

  useEffect(() => {
    const connectAll = async () => {
      if (!devices?.length) return;
      await Promise.all(
        devices.map(async (device) => {
          if (!device.bluetooth_name.includes("MOCK") && !connectedDevicesState[device.id]) {
            await connectDevice(device);
          }
        })
      );
    };

    connectAll();
  }, [devices]);


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

    const connectDevice = async (deviceParam: DeviceData, showToastOnConnect = false, isClick = false) => {
      if (!permissionsGranted) {
        if(showToastOnConnect) ToastNotification(ALERT_TYPE.DANGER, "Permissões necessárias", "Ative as permissões para conectar ao dispositivo");;
        await requestAllPermissions();
        return;
      }

      if (showToastOnConnect) ToastNotification(ALERT_TYPE.WARNING, "Procurando...", "Conectando seu dispositivo");

      
      try {
        if (deviceParam.bluetooth_name.includes("MOCK") && isClick) {
          const { bluetooth_name, service_uuid, characteristic_uuid, id } = deviceParam;
          navigation.navigate("SensorData", {
            BLUETOOTH_NAME: bluetooth_name,
            SERVICE_UUID: service_uuid,
            CHARACTERISTIC_UUID: characteristic_uuid,
            DEVICE_ID: id,
          });
          return;
        }

        if (deviceParam.bluetooth_name.includes("MOCK")) {
          if (showToastOnConnect) ToastNotification(ALERT_TYPE.SUCCESS, "Sucesso", "Dispositivo mock conectado");
          return;
        }

        // Verifica conexão existente
        let device = getConnectedDevice(String(deviceParam.id));
        if (!device) device = await safeReconnect(deviceParam.bluetooth_name);

        if (!(await device.isConnected())) throw new Error("DEVICE_NOT_CONNECTED");

        // Subscription
        if (subscriptionsRef.current[deviceParam.bluetooth_name]) {
          subscriptionsRef.current[deviceParam.bluetooth_name].remove();
        }

        device.onDisconnected((error, dev) => {
            setConnectedDevicesState(prev => ({ ...prev, [deviceParam.id]: false }));
            getErrorToast({message: "DEVICE_DISCONNECTED"});
            return;
        });
        
        const sub = await subscribeSensor(deviceParam.bluetooth_name, deviceParam.service_uuid, deviceParam.characteristic_uuid, (value) => {
          try {
            if (deviceParam.type.includes("IMPACT")) return impactSensor(value);
            return distanceSensor(value);
          } catch (error: any) {
            console.log(error);
          }
        });

        subscriptionsRef.current[deviceParam.bluetooth_name] = sub;

        if (showToastOnConnect) ToastNotification(ALERT_TYPE.SUCCESS, "Sucesso", `${getNameDevice(deviceParam.type)} conectado`);
        setConnectedDevicesState(prev => ({ ...prev, [deviceParam.id]: true }));

      } catch (error: any) {
        setConnectedDevicesState(prev => ({ ...prev, [deviceParam.id]: false }));
        if (showToastOnConnect) getErrorToast(error);
        console.error("Erro ao conectar:", error);
      } finally {
        if (showToastOnConnect) setLoadingConnection(false);
      }
    };

  const removeSelection = () => {
    setSelectedDevice([]);
  }
  
  useEffect(() => {
    list();
  }, [token]);

  const navigationView = () => (
    <View style={[styles.container, inPiP && { display: 'none' }]}>
      {/* Header do menu */}
      <View style={styles.header}>
        {/* <View style={styles.avatar} /> */}
        <Image style={styles.avatar} source={require("../../assets/img_account.jpg")} />
        <Text style={styles.userName}>{user?.name.split(" ")[0]}</Text>
        <Text style={styles.userName}>{user?.email}</Text>
      </View>

      {/* Itens do menu */}
      <TouchableOpacity style={styles.itemMenu} onPress={() => navigation.navigate("Update")} activeOpacity={0.7}>
        <View style={styles.iconCircle}>
          <Text>
            <Pencil size={20} color="#fff" />
          </Text>
        </View>
        <Text style={styles.itemText}>Editar Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.itemMenu} onPress={() => navigation.navigate("emergencyNum")} activeOpacity={0.7}>
        <View style={styles.iconCircle}>
          <Text>
            <Phone size={20} color="#fff" />
          </Text>
        </View>
        <Text style={styles.itemText}>Editar Contato</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.itemMenu} onPress={() => navigation.navigate("password")} activeOpacity={0.7}>
        <View style={styles.iconCircle}>
          <Text>
            <KeyRound size={20} color="#fff" />
          </Text>
        </View>
        <Text style={styles.itemText}>Editar Senha</Text>
      </TouchableOpacity>

      <View style={{ height: 2, width: "100%", backgroundColor: "#333", borderRadius: 5, marginTop: 10, marginBottom: 20 }}/>

      <TouchableOpacity style={styles.itemMenu} onPress={() => confirmLogout()} activeOpacity={0.7}>
        <View style={styles.iconCircle}>
          <Text>
            <LogOut size={20} color="#fff" />
          </Text>
        </View>
        <Text style={styles.itemText}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.itemMenu, styles.danger]}  onPress={() => confirmDeleteAccount()} activeOpacity={0.7}>
        <View style={[styles.iconCircle, styles.dangerCircle]}>
          <Text>
            <Trash2 size={20} color="#ff4d4d" />
          </Text>
        </View>
        <Text style={[styles.itemText, styles.dangerText]}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayoutAndroid ref={drawer} drawerBackgroundColor="#1E1E1E" drawerWidth={300} drawerPosition="right" renderNavigationView={navigationView}> 
      <View style={styles.container}>
        <View style={inPiP && { display: 'none' }}>
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
              <TouchableOpacity onPress={() => drawer.current?.openDrawer()} >
                <Text >
                  <Menu size={20} color={"#fff"}/>
                </Text>
              </TouchableOpacity>
            )}
          </Header>
      </View>

        {/* Conteúdo central */}
        <View style={[styles.content, inPiP && { alignItems: "flex-start", marginTop: 0 }]}>
          {!distanceDevice ? (
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, marginTop: -50 }}>
              <LocateOff size={100} color="#9d9c9cff"/>
              <Text style={{ color: "#fff", marginTop: 20, fontSize: 15, opacity: .8 }}>Nenhum sensor de distância cadastrado</Text>
            </View>
          ) : (
            <View style={[{ display: "flex", alignItems: "center" }, inPiP && { marginTop: -20, marginLeft: 25} ]}>
              <Image source={require("../../assets/frontViewBike.png")} style={[styles.logo, inPiP && { display: "none" } ]} resizeMode="contain"/>
              <Sensor key={distanceValue} color={distanceValue && distanceValue > 0 && distanceValue < 200 ? "#DA4F4F" : undefined} marginVertical={inPiP ? 0 : 0.2} width={inPiP ? 80 : 150} height={inPiP ? 33 : 35} />
              <Sensor key={Number(distanceValue) + 1} color={distanceValue && distanceValue > 0 && distanceValue < 300 ? "#DA4F4F" : undefined} marginVertical={inPiP ? 0 : 0.2} width={inPiP ? 120 : 200} height={inPiP ? 43 : 45} />
              <Sensor key={Number(distanceValue) + 2} color={distanceValue && distanceValue > 0 && distanceValue < 500 ? "#DA4F4F" : undefined} marginVertical={inPiP ? 0 : 0.2} width={inPiP ? 140 : 250} height={inPiP ? 50 : 55} />
            </View>
          )}

        </View>

        {/* Rodapé com botões */}
        <View style={[styles.footer, inPiP && { display: 'none' }]}>

          {/* pip, nao funciona corretamente */}
          {/* <Button title="Ativar PiP" onPress={() => enterPiPMode()} /> */}

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

                if(!connectedDevicesState[device.id])
                  await connectDevice(device, true, true); 
              }}
              onLongPress={() => {
                setSelectedDevice(prev => prev ? [...prev, device] : [device]);
              }}
            />
          ))}

          <Button title="Adicionar Dispositivos" type="secondary" onPress={() => navigation.navigate("QRCodeScreen")} />
        </View>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", // fundo escuro
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#333",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333"
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  itemMenu: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 14,
    marginBottom: 5,
    borderRadius: 15,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  danger: {
    marginTop: 0,
  },
  dangerCircle: {
    backgroundColor: "rgba(255, 77, 77, 0.15)",
  },
  dangerText: {
    color: "#ff4d4d",
    fontWeight: "600",
  },
  itemText: {
    fontSize: 20,
    color: "#fff",
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
