import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaskedTextInput } from "react-native-mask-text";

import Button from "../components/button";
import Header from "../components/header";
import DeviceCard from "../components/device";

export default function Home() {
  const [number, setNumber] = useState("");
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Header title="MotoGuard" />


      <View style={styles.footer}>
        <Button
          title="Adicionar"
          onPress={() => navigation.navigate("register")}
        />
        <Button
          title="Agora não"
          type="secondary"
          onPress={() => navigation.navigate("register")}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 60,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  footerLink: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});