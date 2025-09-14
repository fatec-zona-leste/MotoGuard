import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet, Easing, DimensionValue, ViewStyle, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "react-native-svg";

interface PlaceholderProps {
  width: DimensionValue;
  height: DimensionValue;
  style?: ViewStyle;
  borderRadius?: number;
}

const Placeholder: React.FC<PlaceholderProps> = ({ width, height, style, borderRadius = 5 }) => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  // interpolar movimento da esquerda → direita
  const numericWidth = typeof width === "number" ? width : 0;
  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-numericWidth, numericWidth],
  });

  return (
    <View style={[styles.container, style, { width, height, borderRadius}]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={["transparent", "rgba(206,206,206,0.35)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

export function PlaceholderDeviceCard({ loading = false }: { loading: boolean }) {
  return (
    <>
        {loading ? (
            <View style={[stylesDeviceCard.container]} >
                <View style={stylesDeviceCard.containerImage}>
                    <Placeholder width={75} height={75} />
                </View>

                <View style={stylesDeviceCard.textContainer}>
                    <Placeholder style={{ marginTop: 5 }}  width={"100%"} height={25} />
                    <Placeholder style={{ marginTop: 5 }}  width={"90%"} height={15} />
                    <Placeholder style={{ marginTop: 5 }}  width={"50%"} height={15} />
                </View>
            </View>
        ) : null}
    </>
  );
}

const stylesDeviceCard = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
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


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c2bfbf60",
    overflow: "hidden",
  },
});

export default Placeholder;
