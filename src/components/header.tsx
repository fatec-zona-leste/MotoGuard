import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

interface Props {
  title: string
  showBack?: boolean
  link?: string
}

export default function Header({ title, showBack = true, link }: Props) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      {showBack || link ? (
        <TouchableOpacity onPress={() => link ? navigation.navigate(link) : navigation.goBack()}>
          <Text style={styles.back}>
            <ArrowLeft color={"#fff"}/>
          </Text>
        </TouchableOpacity>
      ): null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    marginBottom: 20,
    marginTop: 20
  },
  back: {
    color: "#fff",
    fontSize: 30,
  },
  title: {
    flex: 1, // ocupa espaço central
    textAlign: "center",
    marginLeft: -10,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
