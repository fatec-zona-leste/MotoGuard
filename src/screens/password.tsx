import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/button";
import Header from "../components/header";
import Input from "../components/input";

export default function Password() {
  const [password, setPassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Header title="Crie uma Senha!" />
      {/* Conteúdo central */}
      <View style={styles.content}>
        <Input
          label="Crie uma Senha"
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
        />
        <Input
          label="Confirme sua Senha"
          placeholder="Senha"
          value={confirmPass}
          onChangeText={setconfirmPass}
          keyboardType="email-address"
        />

        <Button title="Próximo" onPress={() => console.log({ password, confirmPass }, navigation.navigate("emergencyNum"))} />
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
    marginTop:60,
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "#fff",
    fontSize:16,
    marginBottom: 5,
  },
  footerLink: {
    color: "#fff",
    fontSize:16,
    fontWeight: "bold",
  },
});
