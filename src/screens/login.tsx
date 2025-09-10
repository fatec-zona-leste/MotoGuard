import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAuth } from "../contexts/auth-context";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useCameraPermissions } from "expo-camera";
import { requestBluetoothPermissions } from "../services/bluetooth";
import Button from "../components/button";
import Header from "../components/header";
import Input from "../components/input";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoadng] = useState(false);
  const { login } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const navigation = useNavigation<any>();

  useState(async() => {
    await requestBluetoothPermissions();
    if(!isPermissionGranted){
      requestPermission();
    }
  });

  const handleLogin = () => {
    setLoadng(true);
    try {
      if (!email.trim().length || !password.trim().length) {
        ToastNotification(ALERT_TYPE.WARNING, "Atenção", "Informe seu email e senha");
        return;
      }

       if (email != "admin" && password != 'admin') {
        ToastNotification(ALERT_TYPE.DANGER, "Atenção", "Email e/ou senha incorretos");
        return;
      }
      
      login(email, password);

    } catch (error) {
      console.error(error);
      ToastNotification(ALERT_TYPE.DANGER, "Atenção", "Erro ao realizar login");
    } finally {
      setLoadng(false);
    }
  }

  return (
    <View style={styles.container}>
        {/* Cabeçalho */}
        <Header title="Bem-Vindo de volta!" />
        {/* Conteúdo central */}
        <View style={styles.content}>

          <Input
            label="Digite seu Email"
            placeholder="Email@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label="Digite sua Senha"
            placeholder="senha"
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Próximo" onPress={handleLogin} />
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("register")}>
            <Text style={styles.footerLink}>Criar Conta</Text>
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
