import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, SafeAreaView } from "react-native";

import { Header2 } from "../components/headers";
import React from "react";
import { Create } from "../components/firebase/create";

export default function CreateScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <Header2 />
      <View style={styles.content}>
        <Create {...props} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopColor: "rgb(0,0,0)",
    borderTopWidth: 1,
  },
});
