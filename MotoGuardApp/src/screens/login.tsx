import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = () => {
    setError("Senha invalida!!!!!!")
  }

  return (
    <View style={styles.container}>
      {/* Top section */}
      <View style={styles.topContainer}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/icon-transparent.png")} // Substituir pelo seu logo
            style={styles.logo}
          />
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

        <TouchableOpacity onPress={login} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.signUpText}>
          Don't have any account? <Text onPress={() => alert("Não funciona")} style={styles.signUpLink}>Sign Up</Text>
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
    height: "35%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  formContainer: {
    padding: 20,
    marginTop: -40,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
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
