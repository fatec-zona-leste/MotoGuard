import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Button from "../components/button";
import Header from "../components/header";
import Input from "../components/input";
import { useAuth } from "../contexts/auth-context";
import { useCameraPermissions } from "expo-camera";
import { requestAllPermissions } from "../services/permissions";

export default function SignupScreen(props: any) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [isEdditing, setIsEdditing] = useState(!!user);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const navigation = useNavigation<any>();
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useState(async() => {
    await requestAllPermissions();
    if(!isPermissionGranted){
      requestPermission();
    }
  });

  useEffect(() => {
    if(!user) return;

    setName(user.name);
    setEmail(user.email);
    setIsEdditing(true);
  }, [user]);

  const next = async () => {
    setErrors({});

      const newErrors: { name?: string; email?: string } = {};

      if (!email.trim()) newErrors.email = "O email é obrigatório";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email inválido";
      
      if (!name.trim()) newErrors.name = "O nome é obrigatório";
    
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      navigation.navigate("password", { name, email })
  }

  return (
    <View style={styles.container}>
      {/* Conteúdo que sobe com o teclado */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 50}
        keyboardShouldPersistTaps="handled"
      >
        <Header title={!isEdditing ? "Seja Bem-Vindo!" : "Atualizar Conta"}/>

        <View style={styles.content}>
          <Input
            label="Qual é o seu nome?"
            placeholder="seu nome"
            value={name}
            errorMessage={errors.name} 
            onChangeText={setName}
          />
          <Input
            label="Qual é o seu email?"
            placeholder="email@gmail.com"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
            errorMessage={errors.email} 
            keyboardType="email-address"
          />

          <Button
            title="Próximo"
            onPress={next}
          />
        </View>
      </KeyboardAwareScrollView>

      {/* Footer fixo embaixo da tela */}
      {!isEdditing ? (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
    marginBottom: 20,
  },
});
