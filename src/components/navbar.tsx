import { View } from "lucide-react-native";
import { DrawerLayoutAndroid, StyleSheet, Text } from "react-native";
import CustomButton from "./button";
import { RefObject } from "react";

const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
       
    </View>
);

export default navigationView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    width: "100%"
  },
  navigationContainer: {
    backgroundColor: '#1E1E1E',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});