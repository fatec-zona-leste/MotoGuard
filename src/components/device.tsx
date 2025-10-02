import React from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType, TouchableOpacity } from "react-native";
import Placeholder from "./placeholder";

interface Props {
  imageSource?: ImageSourcePropType | undefined, 
  loading?: boolean, 
  title?: string, 
  setelected?: boolean, 
  connected?: boolean, 
  description?: string, 
  onPress?: () => void
  onLongPress?: () => void
}

export default function DeviceCard({ imageSource, loading = false, title, setelected, connected = true, onPress, onLongPress, description }: Props) {
  return (
    <TouchableOpacity activeOpacity={connected ? 1 : 0}  style={[styles.container, setelected && styles.containerSelected]} onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.containerImage}>
        {loading ? <Placeholder width={75} height={75} /> : <Image source={imageSource} style={styles.image} />}
      </View>

      <View style={styles.textContainer}>
        {loading ? <Placeholder style={{ marginTop: 5 }}  width={"100%"} height={25} /> : null}
        {loading ? <Placeholder style={{ marginTop: 5 }} width={"90%"} height={15} /> : null}
        {loading ? <Placeholder style={{ marginTop: 2 }} width={"50%"} height={15} /> : null}
        
        <Text style={styles.title}>{title} {connected ? <View style={[styles.isconnected, { }]}/> : <View style={[styles.isNotConnected, { }]}/>}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 8,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    marginTop: 2,
    marginBottom: 2,
    paddingBottom: 3,
    borderWidth: 1,
    borderColor: "transparent"
  },
  isconnected: {
    height: 20,
    width: 20,
    backgroundColor: "green",
    position: "absolute",
    right: 0,
    marginTop: 20,
    top: 20,
    bottom: -20,
    borderRadius: 8
  },
  isNotConnected: {
    height: 20,
    width: 20,
    backgroundColor: "red",
    position: "absolute",
    right: 0,
    top: 20,
    borderRadius: 8
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
  },
  description: {
    color: "#fff",
    fontWeight: "light",
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4,
  },
});
