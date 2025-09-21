import React, { useState } from "react";
import { View, Image, Pressable, StyleSheet, ImageStyle } from "react-native";
import { TypeSensor } from "../types";

interface SensorProps {
  width?: number;
  height?: number;
  source?: any;
  marginVertical?: number;
  side?: "left" | "right" | "both";
  valueLeft?: number;
  valueRight?:  number;
  valueMiddle?:  number;
  distanceMax?:  number;
}

const SensorSeparate: React.FC<SensorProps> = ({width = 100, height = 40, source, valueLeft, distanceMax, valueMiddle, valueRight, marginVertical = 0.2, side = "both", }) => {
  let containerWidth = width;
  let imageLeft = 0;
  const red = "#DA4F4F";
  let colorLeft = valueLeft && distanceMax && valueLeft < distanceMax ? red : "";
  let colorMiddle = valueMiddle && distanceMax && valueMiddle < distanceMax ? red : "";
  let colorRight = valueRight && distanceMax && valueRight < distanceMax ? red : "";

  return ( 
    <View>
      <View style={{width: containerWidth, height, overflow: "hidden", marginVertical, marginTop: -10}}>
          <Image source={source || require("../../assets/VectorLeft.png")} style={[styles.box, { width: "33%", height: "100%", tintColor: colorLeft, left: imageLeft } as ImageStyle]} resizeMode="stretch" />
          <Image source={source || require("../../assets/VectorMiddle.png")} style={[styles.box, styles.middleContainer, { width: "33%", height: "100%", tintColor: colorMiddle, } as ImageStyle]} resizeMode="stretch" />
          <Image source={source || require("../../assets/VectorRight.png")} style={[styles.box, { width: "33%", height: "100%", tintColor: colorRight, right: imageLeft } as ImageStyle]} resizeMode="stretch" />
        </View> 
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    position: "absolute",
  },
  middleContainer: {
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
});

export default SensorSeparate;
