import React, { useState } from "react";
import { Image, StyleSheet, Pressable, ImageSourcePropType, ImageStyle } from "react-native";

interface SensorProps {
  width?: number;
  height?: number;
  marginVertical?: number;
  color?: string;
  source?: ImageSourcePropType; // permite passar outra imagem se quiser
}

const Sensor: React.FC<SensorProps> = ({ width = 100, height = 40, source, color, marginVertical = 0.2 }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Image
        source={source || require("../../assets/Vector.png")}
        style={[
          styles.box,
          { width, height, tintColor: color, marginVertical: marginVertical } as ImageStyle,
        ]}
        resizeMode="stretch"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    // marginVertical: 0.2,
  },
});

export default Sensor;
