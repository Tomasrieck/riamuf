import { StyleSheet, View, SafeAreaView, StatusBar } from "react-native";
import React from "react";

import { Header1 } from "../components/headers";
import { EditUser } from "../components/firebase/editUser";

export default function ProfileScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <Header1 />
      <View style={styles.content}>
        <EditUser {...props} />
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
