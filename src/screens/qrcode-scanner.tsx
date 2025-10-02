import { CameraView, useCameraPermissions } from "expo-camera";
import { ActivityIndicator, Button, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connectToBluetooth } from "../services/bluetooth";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";
import { useEffect, useState } from "react";
import { getErrorToast } from "../utils/error";
import { useNavigation } from "@react-navigation/native";
import { ScannerScreenProp } from "../types";
import { colors } from "../utils/colors";
import { useAuth } from "../contexts/auth-context";
import Header from "../components/header";
import { save } from "../services/sensor-service";
import { getTypeByBluetoothName } from "../utils/device";
import { requestAllPermissions } from "../services/permissions";

export default function QrcodeScanner() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();
    const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = Boolean(permission?.granted);
    let lastScanTime = 0;
    const { token } = useAuth();

    useState(async() => {
        if(!isPermissionGranted){
            await requestPermission();
        }
    });


    useEffect(() => {
    const checkPermissions = async () => {
        const granted = await requestAllPermissions();

        if (!granted) {
            ToastNotification(ALERT_TYPE.DANGER, "Permissões necessárias", "Ative as permissões para adicionar um dispositivo");
            navigation.navigate("Home");
        }
    };

    checkPermissions();
    }, []);
      
    return (
        <>
        <View style={styleSheet.container}>
            <Header title="MotoGuard" />
            <View style={styleSheet.containerCam}>
                {Platform.OS === "android" ? <StatusBar hidden /> : null}

                {loading && (
                    <>
                        <View style={styleSheet.containerLoading}/>

                        <View style={styleSheet.loading}>
                            <ActivityIndicator size={25} color={"#fff"} />
                            <Text style={{ color: "#FFF", fontSize: 25}}>salvando</Text>
                        </View>
                    </>
                )}

                <CameraView
                    style={styleSheet.camStyle}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr']
                    }}

                    onBarcodeScanned={async ({ data }) => {
                        if(loading) return;
                        // Ignora scans que acontecem em menos de 5s do último
                        const now = Date.now();
                        if (now - lastScanTime < 5000) return;
                        lastScanTime = now;

                        setLoading(true);
                    
                        try {
                            let parsed;

                            try {
                                parsed = JSON.parse(data)
                            } catch (error) {
                                throw new Error("INVALID_QRCODE")
                            }

                            const { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID } = parsed;
                            if(!BLUETOOTH_NAME || !SERVICE_UUID || !CHARACTERISTIC_UUID) throw new Error("INVALID_QRCODE");

                            // if(!BLUETOOTH_NAME.includes("MOCK"))
                            //     await connectToBluetooth(BLUETOOTH_NAME);
                            
                            if(token)
                                await save(token, BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID, getTypeByBluetoothName(BLUETOOTH_NAME));
                            
                            ToastNotification(ALERT_TYPE.SUCCESS, "Dispositivo cadastrado", "Dispositivo cadastrado com sucesso");

                            if(!BLUETOOTH_NAME.includes("MOCK"))
                                return navigation.navigate("Home", { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID });

                            return navigation.navigate("SensorData", { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID });
                        } catch (error: any) {
                            getErrorToast(error);
                            navigation.navigate("Home");
                            console.error("Erro conectar: " + error);
                            console.log("QRCode Data:", data);
                        } finally {
                            setLoading(false);
                        }
                        
                    }}
                />
            </View>

        </View>
        </>
    );

}

const styleSheet = StyleSheet.create({
    containerLoading: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 98,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
    },
    loading: {
        backgroundColor: "#1E1E1E",
        padding: 20,
        zIndex: 99,
        gap: 10,
        width: 250,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        padding: 20,
        justifyContent: "space-between",
    },
    containerCam: {
        backgroundColor: "#1E1E1E",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 20,
    },
    camStyle: {
        borderRadius: 10,
        position: 'absolute',
        width: 300,
        height: 300,
        marginTop: -40,
    }
});