import { CameraView } from "expo-camera";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { connectToBluetooth, requestBluetoothPermissions } from "../services/bluetooth";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";
import { useState } from "react";
import { getErrorToast } from "../utils/error";


export default function QrcodeScanner() {
    const [loading, setLoading] = useState(false);

    return (
        <SafeAreaView style={styleSheet.container}>
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
                        setLoading(true);
                       
                        try {
                            const parsed = JSON.parse(data);
                            if(!parsed.bluetooth) throw new Error("INVALID_QRCODE");
                            
                            const granted = await requestBluetoothPermissions();
                            if (!granted) throw new Error("PERMISSION_DENIED")

                            await connectToBluetooth(parsed.bluetooth);
                            ToastNotification(ALERT_TYPE.SUCCESS, "Dispositivo conectado", "Dispositivo conectado com sucesso");
                        } catch (error: any) {
                            getErrorToast(error);
                            console.error("Erro ao ler QRCode: " + error);
                            console.log("QRCode Data:", data);
                        } finally {
                            setLoading(false);
                        }
                        
                    }}
                />
            )}

        </SafeAreaView>
    );

}

const styleSheet = StyleSheet.create({
    container: {
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
        height: 300
    }
});