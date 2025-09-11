// screens/SensorData.tsx
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { disconnectBluetooth, getConnectedDevice, reconnect, safeReconnect, subscribeSensor } from "../services/bluetooth";
import { sendAlert, verifyImpact } from "../services/sensor-service";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/header";
import { getErrorToast } from "../utils/error";
import { useAuth } from "../contexts/auth-context";

export default function SensorData({ route }: any) {
    const { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID, DEVICE_ID } = route.params;
    const [result, setResult] = useState("");
    const impactBlocked = useRef(false);
    const navigation = useNavigation<any>();
    const { token } = useAuth();

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

    const distanceSensor = (value: string) => {
        if (!impactBlocked.current) {
            setResult(`${value} cm\n` + (Number(value) < 50 ? "PERTO" : ""));
            impactBlocked.current = true;

            setTimeout(() => {
                impactBlocked.current = false; // libera para a próxima leitura
            }, 500);
        }
    }
   
    const impactSensor = async (value: string) => {
        const parts = value.split(",");
        const aSqrt = parseFloat(parts[3] || "0");

        const alertTriggered = await verifyImpact(aSqrt);

        if (alertTriggered && !impactBlocked.current) {
            impactBlocked.current = true;
            setResult("IMPACTO \nENVIANDO ALERTA");
            await sendAlert(token, DEVICE_ID);
            impactBlocked.current = false;

            return;
        }

        if (!impactBlocked.current) {
            setResult(value); // valores normais
        }
    }

    useEffect(() => {
        async function init() {
            try {
                
                if(BLUETOOTH_NAME.includes("DISTANCE_MOCK"))
                    return mockDistanceSensor();
                
                if(BLUETOOTH_NAME.includes("IMPACT_MOCK"))
                    return mockImpactSensor();

                let device = getConnectedDevice();
                if (!device) {
                    device = await safeReconnect(BLUETOOTH_NAME); // passa o nome do dispositivo
                }

                subscribeSensor(device, SERVICE_UUID, CHARACTERISTIC_UUID, (value) => {
                    if(BLUETOOTH_NAME.includes("REAR_SENSOR"))
                        return distanceSensor(value);
                    
                    if(BLUETOOTH_NAME.includes("IMPACT_SENSOR"))
                        return impactSensor(value);
                });
            } catch (error) {
                console.error("Erro ao iniciar sensores:", error);
                getErrorToast(error);
                navigation.navigate("AddDevice")
            }
        } 

        init();
    }, []);

    return (
        <>
        <View style={styles.container}>
            <Header link={"AddDevice"} title="MotoGuard" />

            <View style={styles.containerView}>
                <Text style={styles.label}>{result}</Text>
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
