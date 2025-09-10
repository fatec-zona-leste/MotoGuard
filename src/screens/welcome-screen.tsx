import React from "react";
import { View, Text, Image, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/button";

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <>
      {/* StatusBar escura */}
      <StatusBar
        backgroundColor="#1E1E1E"
        barStyle="light-content"
        translucent={false}
      />

      <View style={styles.container}>
        {/* Conteúdo central */}
        <View style={styles.centerContent}>
          <Image
            source={require("../../assets/moto.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.text}>Segurança em cada quilômetro.</Text>
          <Text style={styles.text}>MotoGuard</Text>
        </View>

        {/* Rodapé com botões */}
        <View style={styles.footer}>
          <Button
            title="Criar Conta"
            onPress={() => navigation.navigate("register")}
          />
          <Button
            title="Entrar"
            type="secondary"
            onPress={() => navigation.navigate("login")}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", // fundo escuro
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    marginTop: "auto", // garante que fique no fim da tela
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 149,
    height: 137,
    marginBottom: 20,
  },
  text: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
