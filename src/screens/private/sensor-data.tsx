// screens/SensorData.tsx
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getConnectedDevice, reconnect, subscribeSensor } from "../../services/bluetooth";
import { verifyImpact } from "../../services/sensor-impact";

export default function SensorData({ route }: any) {
    const { SERVICE_UUID, CHARACTERISTIC_UUID } = route.params;
    const [impact, setImpact] = useState("");

    useEffect(() => {
    let impactBlocked = false;

    async function init() {
        try {
            let device = getConnectedDevice();
            if (!device) device = await reconnect();

            subscribeSensor(device, SERVICE_UUID, CHARACTERISTIC_UUID, (value) => {
                const parts = value.split(",");
                const aSqrt = parseFloat(parts[3] || "0");

                if (verifyImpact(aSqrt) && !impactBlocked) {
                    setImpact("IMPACTO");
                    impactBlocked = true;

                    setTimeout(() => {
                        setImpact(""); // limpa o impacto após 5 segundos
                        impactBlocked = false; // libera novas leituras
                    }, 3000);

                    return;
                }

                if (!impactBlocked) {
                    setImpact(value); // valores normais
                }
            });
        } catch (error) {
            console.error("Erro ao iniciar sensores:", error);
        }
    }

    init();
}, []);


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Impacto: {impact}</Text>
            {/* <Text style={styles.label}>Distância: {distance}</Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E1E1E" },
    label: { color: "#FFF", fontSize: 20, margin: 10 },
});
