import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaskedTextInput } from "react-native-mask-text";

import Button from "../components/button";
import Header from "../components/header";
import Input from "../components/input";

export default function EmergencyNum() {
  const [number, setNumber] = useState("");
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Header title="Falta Pouco!" />

      {/* Conteúdo central */}
      <View style={styles.content}>
        <Text style={{ color: "#fff", marginBottom: 10 }}>
          Informe um contato de Emergência
        </Text>

        <Input 
          mask="99-99999-9999"
          keyboardType="phone-pad"
          placeholder="11-90000-0000"
          style={styles.input}
          value={number}
          onChangeText={(text, rawText) => {
            if(rawText) setNumber(rawText); // rawText = só números
          }}
        />

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

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("login")}>
          <Text style={styles.footerLink}>Entrar</Text>
        </TouchableOpacity>
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
