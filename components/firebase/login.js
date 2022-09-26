import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TextInputComponent,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "./config";

import { AntDesign } from "@expo/vector-icons";

export var userRoom = "";

export const Login = (props) => {
  const [email, setEmail] = useState("tomasrieck@gmail.com");
  const [password, setPassword] = useState("Jesorm99");

  function logIn() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .firestore()
          .collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .get()
          .then((documentSnapshot) => {
            userRoom = documentSnapshot.data().Room;
            props.navigation.navigate("Home");
            console.log("Øvelokale:", { userRoom });
          });
        console.log(firebase.auth().currentUser.uid, "er logget ind");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }
        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email..."
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password..."
          autoCapitalize="none"
          secureTextEntry={true}
        />
      </View>
      <View style={styles.buttonField}>
        <TouchableOpacity style={styles.loginButton} onPress={logIn}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => props.navigation.navigate("CreateScreen")}
        >
          <Text style={styles.createButtonText}>Opret Bruger</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.75,
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  inputContainer: {
    flex: 0.25,
    flexDirection: "column",
    justifyContent: "space-around",
    width: "75%",
  },
  input: {
    padding: 15,
    borderRadius: 7,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonField: {
    flex: 0.25,
    width: "75%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  loginButton: {
    padding: 15,
    borderRadius: 7,
    backgroundColor: "rgb(187, 36, 25)",
    borderColor: "gray",
    borderWidth: 1,
    alignItems: "center",
  },
  loginButtonText: { color: "white", fontSize: 20, fontWeight: "700" },
  createButton: {
    padding: 15,
    borderRadius: 7,
    backgroundColor: "white",
    borderColor: "rgb(187, 36, 25)",
    borderWidth: 1.5,
    alignItems: "center",
  },
  createButtonText: {
    color: "rgb(187, 36, 25)",
    fontSize: 20,
    fontWeight: "700",
  },
});
