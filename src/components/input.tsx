import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { colors } from "../utils/colors";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react-native";

interface Props extends TextInputProps {
  label?: string
  value?: string
  onChangeText: (text: string, rawText?: string) => void
  placeholder?: string
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad" | "visible-password"
  secureTextEntry?: boolean
  mask?: string
  errorMessage?: string
}

export default function Input({ label, value, onChangeText, placeholder, keyboardType = "default", secureTextEntry = false, errorMessage, mask, ...res } : Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {mask ? (
        <MaskedTextInput
          mask={mask}
          style={[styles.input, errorMessage ? { borderWidth: 1, borderColor: colors.red } : {}]}
          value={String(value)}
          onChangeText={onChangeText} // ignora o rawText
          placeholder={placeholder}
          placeholderTextColor="#555"
          keyboardType={keyboardType}
          {...res}
        />

      ) : (
        <View style={{ position: "relative", width: "100%" }}>
          <TextInput
            style={[styles.input, errorMessage ? { borderWidth: 1, borderColor: colors.red } : {}]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#555"
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry && !showPassword}
            {...res}
            />

            {secureTextEntry && (
              <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
                {!showPassword ? <Eye size={24} color="#fff"/> : <EyeClosed size={24} color="#fff"/> }
              </TouchableOpacity>
            )}
          </View>
      )}

      {errorMessage && <Text style={{ color: colors.red, marginTop: 4 }}>{errorMessage}</Text>}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 30,
  },
  label: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#333",
    fontSize: 20,
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  icon: {
    position: "absolute", 
    right: 15,
    bottom: "50%",
    transform: [{ translateY: "52%" }], // centraliza verticalmente
  }
});
