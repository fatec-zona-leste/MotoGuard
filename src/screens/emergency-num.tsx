import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaskedTextInput } from "react-native-mask-text";

import Button from "../components/button";
import Header from "../components/header";
import Input from "../components/input";
import { useAuth } from "../contexts/auth-context";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";

export default function EmergencyNum(props: any) {
  const params = props.route.params;
  const { user, token } = useAuth();
  const [number, setNumber] = useState(user?.emergency_number ?? "");
  const navigation = useNavigation<any>();
  const [errors, setErrors] = useState<{ emergency_number?: string }>({});
  const [isEdditing, setIsEdditing] = useState(!!user);
  const { register, login, update } = useAuth();
  const [loading, setLoadng] = useState(0);

  useEffect(() => {
    if(!user) return;
    setNumber(user?.emergency_number ?? "");
    setIsEdditing(true);
  }, [user]);

  const next = async () => {
    setErrors({});

    try{
      const newErrors: { emergency_number?: string; } = {};

      if (number.trim() && number.trim().length !== 13) newErrors.emergency_number = "Informe um número de telefone valido";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      if(!isEdditing || !token){
        await register(params.email, params.password, params.name, number)
        await login(params.email, params.password);
        ToastNotification(ALERT_TYPE.SUCCESS, "Conta criada", "Você está logado!");
        return;
      }

      await update(token, params.email, params.password, params.name, number);
      ToastNotification(ALERT_TYPE.SUCCESS, "Sucesso", "Conta atualizada!");
      navigation.navigate("Home");

    } catch (error: any) {
      console.error(error);
      if (error.errors) {
        setErrors(error.errors);
        // Mostrar toast para todos os erros recebidos do backend
        Object.entries(error.errors).forEach(([field, message]: [string, any]) => {
          if (field !== "emergency_number") {
            ToastNotification(ALERT_TYPE.DANGER, `Erro no campo: ${field}`, message);
          }
        });
      }
      
      else ToastNotification(ALERT_TYPE.DANGER, "Atenção", error.message || "Erro ao realizar login");
    } finally {
      setLoadng(0);
    }
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Header title="Falta Pouco!" />

      {/* Conteúdo central */}
      <View style={styles.content}>
        <Text style={{ color: "#fff", marginBottom: 10 }}>
        </Text>

        <Input 
          label="Informe um contato de Emergência:"
          mask="+55 (99) 99999-9999"
          keyboardType="phone-pad"
          placeholder="+55 (11) 90000-0000"
          value={number}
          errorMessage={errors.emergency_number}
          onChangeText={(text, rawText) => {
            if(rawText) setNumber(rawText);
          }}
        />

        <Button
          title="Adicionar"
          onPress={() => { setLoadng(1); next(); }}
          loading={loading == 1}
          disabled={loading != 0}
        />
        <Button
          loading={loading == 2}
          disabled={loading != 0}
          title="Agora não"
          type="secondary"
          onPress={() => { setLoadng(2); next(); }}
        />
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
