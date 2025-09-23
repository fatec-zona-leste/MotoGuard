import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform, PermissionsAndroid } from "react-native";
import { useAuth } from "../contexts/auth-context";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useCameraPermissions } from "expo-camera";
import Button from "../components/button";
import Header from "../components/header";
import Input from "../components/input";
import { useNavigation } from "@react-navigation/native";
import { requestAllPermissions } from "../services/permissions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoadng] = useState(false);
  const { login } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const navigation = useNavigation<any>();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useState(async() => {
    await requestAllPermissions();
    if(!isPermissionGranted){
      requestPermission();
    }
  });

  const handleLogin = async () => {
    setLoadng(true);
    setErrors({});

    try {
      const newErrors: { email?: string; password?: string } = {};

      if (!email.trim()) newErrors.email = "O email é obrigatório";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email inválido";

      if (!password.trim()) newErrors.password = "A senha é obrigatória";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoadng(false);
        return;
      }

      await login(email, password);

    } catch (error: any) {
      console.error(error);
      if (error.errors) setErrors(error.errors);  // Se o backend retornar errors por campo
      else ToastNotification(ALERT_TYPE.DANGER, "Atenção", error.message || "Erro ao realizar login");
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
            label="Digite seu email"
            placeholder="email@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={errors.email} 
          />
          <Input
            label="Digite sua senha"
            placeholder="senha"
            value={password}
            autoCapitalize="none"
            onChangeText={setPassword}
            errorMessage={errors.password}
            secureTextEntry={true}
          />
          <Button loading={loading} title="Próximo" onPress={handleLogin}/>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem uma conta?</Text>
          <TouchableOpacity disabled={loading} onPress={() => navigation.navigate("register")}>
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
    marginBottom: 20 ,
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
    marginBottom: 20,
  },
});
