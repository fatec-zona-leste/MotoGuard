import { CameraView } from "expo-camera";
import { Button, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connectToBluetooth, requestBluetoothPermissions } from "../services/bluetooth";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";
import { useState } from "react";
import { getErrorToast } from "../utils/error";
import { useNavigation } from "@react-navigation/native";
import { ScannerScreenProp } from "../types";
import { colors } from "../utils/colors";
import { useAuth } from "../contexts/auth-context";
import Header from "../components/header";
import { save } from "../services/sensor-service";
import { getTypeByBluetoothName } from "../utils/device";

export default function QrcodeScanner() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();
    let lastScanTime = 0;
    const { token } = useAuth();

    return (
        <>
        <View style={styleSheet.container}>
            <Header title="MotoGuard" />
            <View style={styleSheet.containerCam}>
                {Platform.OS === "android" ? <StatusBar hidden /> : null}

                {loading && (
                    <View>
                        <Text style={{ color: "#FFF", fontSize: 18 }}>Conectando...</Text>
                    </View>
                )}

                {!loading && (
                    <CameraView
                        style={styleSheet.camStyle}
                        facing="back"
                        barcodeScannerSettings={{
                            barcodeTypes: ['qr']
                        }}

                        onBarcodeScanned={async ({ data }) => {
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
                                
                                const granted = await requestBluetoothPermissions();
                                if (!granted) throw new Error("PERMISSION_DENIED")

                                if(!BLUETOOTH_NAME.includes("MOCK"))
                                    await connectToBluetooth(BLUETOOTH_NAME);
                                
                                if(token)
                                    await save(token, BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID, getTypeByBluetoothName(BLUETOOTH_NAME));
                                ToastNotification(ALERT_TYPE.SUCCESS, "Dispositivo conectado", "Dispositivo conectado com sucesso");

                                navigation.navigate("SensorData", { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID });
                            } catch (error: any) {
                                getErrorToast(error);
                                navigation.navigate("AddDevice");
                                console.error("Erro conectar: " + error);
                                console.log("QRCode Data:", data);
                            } finally {
                                setLoading(false);
                            }
                            
                        }}
                    />
                )}
            </View>

        </View>
        </>
    );

}

const styleSheet = StyleSheet.create({
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
        marginTop: -40
    }
});