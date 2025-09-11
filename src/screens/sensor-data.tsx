// screens/SensorData.tsx
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { disconnectBluetooth, getConnectedDevice, reconnect, subscribeSensor } from "../services/bluetooth";
import { verifyImpact } from "../services/sensor-service";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/header";

export default function SensorData({ route }: any) {
    const { BLUETOOTH_NAME, SERVICE_UUID, CHARACTERISTIC_UUID } = route.params;
    const [result, setResult] = useState("");
    const impactBlocked = useRef(false);

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
        <>
        <View style={styles.container}>
            <Header link="AddDevice" title="MotoGuard" />

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
