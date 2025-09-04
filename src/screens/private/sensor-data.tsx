// screens/SensorData.tsx
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { disconnectBluetooth, getConnectedDevice, reconnect, subscribeSensor } from "../../services/bluetooth";
import { verifyImpact } from "../../services/sensor-impact";
import { useFocusEffect } from "@react-navigation/native";

export default function SensorData({ route }: any) {
    const { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID } = route.params;
    const [result, setResult] = useState("");
    const impactBlocked = useRef(false);

    const distanceSensor = (value: string) => {
        if (!impactBlocked.current) {
            setResult(`${value} cm\n` + (Number(value) < 50 ? "PERTO" : ""));
            impactBlocked.current = true;

            setTimeout(() => {
                impactBlocked.current = false; // libera para a próxima leitura
            }, 500);
        }
    }
   
    const impactSensor = (value: string) => {
        const parts = value.split(",");
        const aSqrt = parseFloat(parts[3] || "0");

        if (verifyImpact(aSqrt) && !impactBlocked.current) {
            setResult("IMPACTO");
            impactBlocked.current = true;

            setTimeout(() => {
                setResult("");
                impactBlocked.current = false;
            }, 3000);

            return;
        }

        if (!impactBlocked) {
            setResult(value); // valores normais
        }
    }

    useEffect(() => {
        async function init() {
            try {
                let device = getConnectedDevice();
                if (!device) device = await reconnect();

                subscribeSensor(device, SERVICE_UUID, CHARACTERISTIC_UUID, (value) => {
                    if(BLUETOOTH_NAME.includes("REAR_SENSOR"))
                        return distanceSensor(value);
                    
                    if(BLUETOOTH_NAME.includes("IMPACT_SENSOR"))
                        return impactSensor(value);
                });
            } catch (error) {
                console.error("Erro ao iniciar sensores:", error);
            }
        } 

        init();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{result}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E1E1E" },
    label: { color: "#FFF", fontSize: 20, margin: 10 },
});
