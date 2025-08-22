import { CameraView } from "expo-camera";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { connectToBluetooth } from "../../services/bluetooth";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";


export default function QrcodeScanner() {

    return (
        <SafeAreaView style={styleSheet.container}>
            {Platform.OS === "android" ? <StatusBar hidden /> : null}

            <CameraView
                style={styleSheet.camStyle}
                facing="back"
                barcodeScannerSettings={{
                        barcodeTypes: ['qr']
                }}

                onBarcodeScanned={({ data }) => {
                    try {
                    const parsed = JSON.parse(data);

                    if(!parsed.bluetooth){
                        ToastNotification(ALERT_TYPE.DANGER, "Erro ao escanear", "QRCode inválido");
                        return;
                    }

                    try {
                        connectToBluetooth(parsed.bluetooth);
                    } catch (error) {
                        ToastNotification(ALERT_TYPE.WARNING, "Erro ao conectar", String(error));
                    }

                } catch (error) {
                    console.log("QR inválido:", data);
                }
                }}
            />

        </SafeAreaView>
    );

}

const styleSheet = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 20
    },
    camStyle: {
        position: 'absolute',
        width: 300,
        height: 300
    }
});