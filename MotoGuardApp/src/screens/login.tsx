import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAuth } from "../contexts/auth-context";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useCameraPermissions } from "expo-camera";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoadng] = useState(false);
  const { login } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  useState(() => {
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
      {/* Top section */}
      <View style={styles.topContainer}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image source={require("../../assets/icon-transparent-white.png")} style={styles.logo}/>
        </View>
      </View>

      {/* Form section */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          autoCapitalize="none"
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity disabled={loading} onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.signUpText}>
          Não tem conta? <Text onPress={() => ToastNotification(ALERT_TYPE.DANGER, "Atenção", "Ainda não implementado") } style={styles.signUpLink}>Cadastre-se</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    backgroundColor: "#000",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    borderRadius: 15,
    padding: 10,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  formContainer: {
    padding: 20,
    marginTop: -40,
    backgroundColor: "#fff",
    borderRadius: 35,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#f7f3f3ff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f7f3f3ff",
    color: "#000"
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signUpText: {
    textAlign: "center",
    color: "#555",
  },
  signUpLink: {
    color: "#000",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10
  }
});
