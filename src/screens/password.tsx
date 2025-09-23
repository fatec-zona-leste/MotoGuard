import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/button";
import Header from "../components/header";
import Input from "../components/input";
import { useAuth } from "../contexts/auth-context";
import { ToastNotification } from "../components/alert";
import { ALERT_TYPE } from "react-native-alert-notification";

export default function Password(props: any) {
  const params = props.route.params;
  const [password, setPassword] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const navigation = useNavigation<any>();
  const { user, token, update } = useAuth();
  const [isEdditing, setIsEdditing] = useState(!!user);
  const [errors, setErrors] = useState<{ password?: string; confirmPass?: string, oldPass?: string }>({});

  const next = async () => {
    setErrors({});

      const newErrors: { password?: string; confirmPass?: string, oldPass?: string } = {};

      if (password == oldPass) newErrors.password = "A senha atual não pode ser igual a anterior";
      if (password.trim().length <8 ) newErrors.password = "A senha precisa ter 8 caracteres";
      if (!password.trim()) newErrors.password = "A senha é obrigatória";
      if (!oldPass.trim()) newErrors.oldPass = "Informe sua senha atual";

      if (confirmPass != password) newErrors.confirmPass = "As senhas não conferem";
    
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      if(isEdditing && token && user){
        await update(token, user.email, password, user.name, user?.emergency_number ?? "", oldPass);
        ToastNotification(ALERT_TYPE.SUCCESS, "Conta atualizada", "Sua senha foi atualizada!");
        navigation.reset({ index: 0, routes: [{ name: "Home" }]});
        return;
      }
      
      navigation.navigate("emergencyNum", { password, name: params.name, email: params.email })
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Header title={!isEdditing ? "Crie uma Senha!" : "Atualize sua senha"} />
      {/* Conteúdo central */}
      <View style={styles.content}>
        <Input
          label="Senha atual"
          placeholder="senha"
          value={oldPass}
          errorMessage={errors.oldPass} 
          onChangeText={setOldPass}
          secureTextEntry={true}
        />
        <Input
          label="Crie uma senha"
          placeholder="nova senha"
          value={password}
          errorMessage={errors.password} 
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Input
          label="Confirme sua senha"
          placeholder="confirmação de senha"
          value={confirmPass}
          errorMessage={errors.confirmPass} 
          onChangeText={setconfirmPass}
          secureTextEntry={true}
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
