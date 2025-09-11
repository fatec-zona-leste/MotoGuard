import React from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType, TouchableOpacity } from "react-native";

interface Props {
  imageSource: ImageSourcePropType | undefined, 
  title: string, 
  setelected: boolean, 
  description: string, 
  onPress?: () => void
  onLongPress?: () => void
}

export default function DeviceCard({ imageSource, title, setelected, onPress, onLongPress, description }: Props) {
  return (
    <TouchableOpacity style={[styles.container, setelected && styles.containerSelected]} onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.containerImage}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "transparent"
  },
  containerSelected: {
    borderColor: "red",
  },
  containerImage: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#333",
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: "90%"
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "light",
    marginBottom: 4,
  },
  description: {
    color: "#fff",
    fontWeight: "light",
    fontSize: 16,
  },
});
