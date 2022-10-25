import { StyleSheet, View, SafeAreaView } from "react-native";

import { Header1 } from "../components/headers";
import { Calendar } from "../components/firebase/calendar";
import React from "react";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <Header1 />
      <View style={styles.content}>
        <Calendar />
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
    backgroundColor: "rgb(187, 36, 25)",
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: "rgb(0,0,0)",
    borderTopWidth: 1,
    borderBottomColor: "rgb(0,0,0)",
    borderBottomWidth: 1,
  },
});
