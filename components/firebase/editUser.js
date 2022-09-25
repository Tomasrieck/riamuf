import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "./config";

import { AntDesign } from "@expo/vector-icons";

export const EditUser = () => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 0.89,
    width: "87%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 7,
    shadowColor: "rgb(0,0,0)",
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
});
