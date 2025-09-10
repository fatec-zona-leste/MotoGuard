import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Button from "../components/button";
import Header from "../components/header";
import Input from "../components/input";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Conteúdo que sobe com o teclado */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 50}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Seja Bem-Vindo!" />

        <View style={styles.content}>
          <Input
            label="Qual é o seu Nome?"
            placeholder="Seu Nome"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="Qual é o seu Email?"
            placeholder="Email@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Button
            title="Próximo"
            onPress={() =>
              navigation.navigate("password", { name, email })
            }
          />
        </View>
      </KeyboardAwareScrollView>

      {/* Footer fixo embaixo da tela */}
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  content: {
    marginTop: 60,
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    padding: 20,
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
