// screens/SensorData.tsx
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { disconnectBluetooth, getConnectedDevice, reconnect, safeReconnect, subscribeSensor } from "../services/bluetooth";
import { sendAlert, verifyImpact } from "../services/sensor-service";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/header";
import { getErrorToast } from "../utils/error";
import { useAuth } from "../contexts/auth-context";
import Slider from "@react-native-community/slider";
import { getTypeByBluetoothName } from "../utils/device";
import { TypeSensor } from "../types";

export default function SensorData({ route }: any) {
    const { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID, DEVICE_ID } = route.params;
    const [result, setResult] = useState("");
    const impactBlocked = useRef(false);
    const navigation = useNavigation<any>();
    const { token } = useAuth();
    const [sensitivity, setSensitivity] = useState(2.5);

    const sensitivityRef = useRef(sensitivity);
    useEffect(() => {
        sensitivityRef.current = sensitivity;
    }, [sensitivity]);

    const mockDistanceSensor = () => {
        const interval = setInterval(() => {
            if (!impactBlocked.current) {
                let value = (Math.random() * 100).toFixed(1);
                const near = Number(value) < 30;
                setResult(`Distância do sensor: \n${value} cm\n` + (near ? "PERTO" : ""));
                impactBlocked.current = true;

                setTimeout(() => {
                    impactBlocked.current = false;
                }, 500);
            }
        }, 1000); // gera a cada 1 segundo

        return () => clearInterval(interval); // cleanup no unmount
    };

    const mockImpactSensor = () => {
        const interval = setInterval(() => {
            if (!impactBlocked.current) {
                let value = (Math.random() * 100).toFixed(1);
                const impact = Number(value) < 50;
                setResult(`Valores do impacto ${value}\n` + (impact ? "IMPACTO" : ""));
                impactBlocked.current = true;

                setTimeout(() => {
                    impactBlocked.current = false;
                }, impact ? 3000 : 500);
            }
        }, 1000);

        return () => clearInterval(interval);
    };

    useEffect(() => {
        async function init() {
            try {
                if(BLUETOOTH_NAME.includes("DISTANCE_MOCK"))
                    return mockDistanceSensor();
                
                if(BLUETOOTH_NAME.includes("IMPACT_MOCK"))
                    return mockImpactSensor();
            } catch (error) {
                console.error("Erro ao iniciar sensores:", error);
                getErrorToast(error);
                navigation.navigate("Home")
            }
        } 

        init();
    }, []);

    return (
        <>
        <View style={styles.container}>
            <Header link={"Home"} title="MotoGuard" />

            <View style={styles.containerView}>
                <Text style={styles.label}>{result}</Text>

                {getTypeByBluetoothName(BLUETOOTH_NAME) === TypeSensor.IMPACT_SENSOR ? (
                    <>
                        <Text style={styles.label}>Sensibilidade: {sensitivity.toFixed(1)}</Text>
                        <Slider
                            style={{width: "100%", height: 40}}
                            minimumValue={0.5}
                            maximumValue={10}
                            step={0.1}
                            value={sensitivity}
                            minimumTrackTintColor="#1EB1FC"
                            maximumTrackTintColor="#FFFFFF"
                            thumbTintColor="#1EB1FC"
                            onValueChange={setSensitivity}
                        />
                    </>
                ) : null}
            </View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: "#1E1E1E",
        padding: 20,
    },
    containerView: { 
        flex: 1,
        backgroundColor: "#1E1E1E",
        padding: 20,
        justifyContent: "center",
    },
    label: { color: "#FFF", fontSize: 20, margin: 10, textAlign: "center" },
});
