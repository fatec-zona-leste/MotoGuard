import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  title: string
  disabled?: boolean
  onPress: () => void
  type?: string
}

export default function CustomButton({ title, disabled = false, onPress, type = "primary" }: Props) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, type === "primary" ? styles.primary : styles.secondary]}
      onPress={onPress}
    >
      <Text
        style={[styles.text, type === "primary" ? styles.textPrimary : styles.textSecondary]}
      >
        {title}
      </Text>
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
