import { StyleSheet, View, SafeAreaView, StatusBar } from "react-native";

import { Header2 } from "../components/headers";
import { Login } from "../components/firebase/login";
import React from "react";

export default function LoginScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <Header2 />
      <View style={styles.content}>
        <Login {...props} />
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
