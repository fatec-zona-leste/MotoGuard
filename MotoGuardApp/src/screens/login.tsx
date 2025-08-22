import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAuth } from "../contexts/auth-context";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useCameraPermissions } from "expo-camera";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    setError("");
    try {
      if (!email.trim().length || !password.trim().length) {
        setError("Informe seu login e senha")
        return;
      }

       if (email != "admin" && password != 'admin') {
        setError("Usuário e/ou senha inválidos")
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
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.error}>{error}</Text>

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
    backgroundColor: "#f9f9f9",
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
    borderColor: "#F7F8F9",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#e2e5e9",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
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
