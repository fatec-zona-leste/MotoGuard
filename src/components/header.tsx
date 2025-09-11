import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

interface Props {
  title: string
  showBack?: boolean
  link?: string
  children?: React.ReactNode
}

export default function Header({ title, showBack = true, link, children}: Props) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <View style={{flex: 1}}>
        {showBack || link ? (
          <TouchableOpacity onPress={() => link ? navigation.navigate(link) : navigation.goBack()}>
            <Text style={styles.back}>
              <ArrowLeft color={"#fff"}/>
            </Text>
          </TouchableOpacity>
        ): null}
        </View>
      <Text style={styles.title}>{title}</Text>
      <View style={{ display: "flex", flex: 1, justifyContent: "flex-end", flexDirection: "row", gap: 10 }}>
        {children ? children : <View style={{ width: 24 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    left: 50,
    right: 50,
  },
});
