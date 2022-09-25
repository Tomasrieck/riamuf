import { StyleSheet, View, Image } from "react-native";
import React, { useState } from "react";

export const Header1 = () => {
  return (
    <View style={styles.header1}>
      <Image style={styles.logo1} source={require("../assets/logo.png")} />
    </View>
  );
};

export const Header2 = () => {
  return (
    <View style={styles.header2}>
      <Image style={styles.logo2} source={require("../assets/logo.png")} />
    </View>
  );
};

const styles = StyleSheet.create({
  header1: {
    flex: 0.1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  logo1: {
    width: 200,
    height: 39,
    marginLeft: "3%",
  },
  header2: {
    flex: 0.1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  logo2: {
    width: 200,
    height: 39,
  },
});
