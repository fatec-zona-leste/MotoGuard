import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/button";
import Header from "../components/header";
import Input from "../components/input";

export default function Password(props: any) {
  const params = props.route.params;
  const [password, setPassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  const navigation = useNavigation<any>();
  const [errors, setErrors] = useState<{ password?: string; confirmPass?: string }>({});

  const next = async () => {
    setErrors({});

      const newErrors: { password?: string; confirmPass?: string } = {};

      if (password.trim().length <8 ) newErrors.password = "A senha precisa ter 8 caracteres";
      if (!password.trim()) newErrors.password = "A senha é obrigatória";
      if (confirmPass != password) newErrors.confirmPass = "As senhas não conferem";
    
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      navigation.navigate("emergencyNum", { password, name: params.name, email: params.email })
  }

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
          errorMessage={errors.password} 
          onChangeText={setPassword}
        />
        <Input
          label="Confirme sua Senha"
          placeholder="Senha"
          value={confirmPass}
          errorMessage={errors.confirmPass} 
          onChangeText={setconfirmPass}
          keyboardType="email-address"
        />

        <Button title="Próximo" onPress={next} />
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
