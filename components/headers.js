import { StyleSheet, View, Image, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { firebase } from "./firebase/config";

export const Header1 = () => {
  var user = [];
  const [userName, setUserName] = useState(null);
  const userRef = firebase
    .firestore()
    .collection("Users")
    .where("UserId", "==", firebase.auth().currentUser.uid);

  useEffect(() => {
    userRef.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { Name } = doc.data();
        user.push({
          Name,
        });
        setUserName(Name.split(" "));
      });
    });
  }, []);

  return (
    <View style={styles.header1}>
      <Image style={styles.logo1} source={require("../assets/logo.png")} />
      {userName && (
        <View style={styles.textfield}>
          <View style={styles.firstNameTextBox}>
            <Text style={styles.firstNameText}>{userName[0]} </Text>
          </View>
          <View style={styles.nameTextBox}>
            <Text style={styles.nameText}>{userName[userName.length - 1]}</Text>
          </View>
        </View>
      )}
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
  textfield: {
    flexDirection: "row",
    marginRight: "3.7%",
  },
  firstNameTextBox: {
    justifyContent: "center",
  },
  firstNameText: {
    fontSize: 16,
    fontWeight: "600",
  },
  nameTextBox: {
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
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
