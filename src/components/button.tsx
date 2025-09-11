import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

interface Props {
  title: string
  disabled?: boolean
  onPress: () => void
  type?: string
  loading?: boolean;
}

export default function CustomButton({ title, disabled = false, onPress, type = "primary", loading }: Props) {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.button,
        type === "primary" ? styles.primary : styles.secondary,
        (disabled || loading) && styles.disabledButton,
      ]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={type === "primary" ? "#000" : "#fff"} />
      ) : (
        <Text style={[ styles.text, type === "primary" ? styles.textPrimary : styles.textSecondary, ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "90%",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: "#999",
    borderColor: "#999",
  },
  primary: {
    backgroundColor: "#fff",
  },
  secondary: {
    borderWidth: 1,
    borderColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textPrimary: {
    color: "#000",
  },
  textSecondary: {
    color: "#fff",
  },
});
