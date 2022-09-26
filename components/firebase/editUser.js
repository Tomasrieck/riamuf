import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import React, { useState, useEffect } from "react";
import { firebase } from "./config";

import { AntDesign } from "@expo/vector-icons";

export const EditUser = (props) => {
  const [name, setName] = useState();
  const [mobile, setMobile] = useState();
  const [room, setRoom] = useState();
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const rooms = ["Øvelokale 1", "Øvelokale 2", "Øvelokale 3"];
  const [loading, setLoading] = useState();

  const userRef = firebase
    .firestore()
    .collection("Users")
    .where("UserId", "==", firebase.auth().currentUser.uid);

  function editUser() {
    setLoading(true);
    if (newName != "") {
      firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .update({
          Name: newName,
        })
        .then(() => {
          setLoading(false);
          console.log("Navn ændret");
        });
    } else if (newMobile != "") {
      firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .update({
          Mobile: newMobile,
        })
        .then(() => {
          setLoading(false);
          console.log("Mobil ændret");
        });
    } else if (newRoom != "") {
      firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .update({
          Room: newRoom,
        })
        .then(() => {
          setLoading(false);
          props.navigation.navigate("LoginScreen");
          console.log("Øvelokale ændret");
        });
    } else if (newName != "" && newMobile != "" && newRoom != "") {
      firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .update({
          Name: newName,
          Mobile: newMobile,
          Room: newRoom,
        })
        .then(() => {
          setLoading(false);
          props.navigation.navigate("LoginScreen");
          console.log("Navn, mobil og øvelokale ændret");
        });
    } else if (newName != "" && newMobile != "") {
      firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .update({
          Name: newName,
          Mobile: newMobile,
        })
        .then(() => {
          setLoading(false);
          console.log("Navn og mobil ændret");
        });
    } else if (newName != "" && newRoom != "") {
      firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .update({
          Name: newName,
          Room: newRoom,
        })
        .then(() => {
          setLoading(false);
          props.navigation.navigate("LoginScreen");
          console.log("Navn og øvelokale ændret");
        });
    } else if (newMobile != "" && newRoom != "") {
      firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .update({
          Mobile: newMobile,
          Room: newRoom,
        })
        .then(() => {
          setLoading(false);
          props.navigation.navigate("LoginScreen");
          console.log("Mobil og øvelokale ændret");
        });
    } else {
      console.log("Ingen ændringer registreret.");
    }
  }

  useEffect(() => {
    userRef.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { Name, Mobile, Room } = doc.data();
        setName(Name);
        setMobile(Mobile);
        setRoom(Room);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputField}>
          <Text style={styles.inputCaption}>Navn:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNewName}
            value={newName}
            placeholder={name}
            autoCorrect={false}
            maxLength={25}
          />
        </View>
        <View style={styles.inputField}>
          <Text style={styles.inputCaption}>Mobil:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNewMobile}
            value={newMobile}
            placeholder={mobile}
            autoCorrect={false}
            maxLength={8}
          />
        </View>
        <View style={styles.inputField}>
          <Text style={styles.inputCaption}>Øvelokale:</Text>
          <SelectDropdown
            renderDropdownIcon={() => (
              <AntDesign name={"down"} size={24} color={"rgb(187, 36, 25)"} />
            )}
            dropdownIconPosition="left"
            buttonStyle={{
              width: "100%",
              alignText: "left",
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 7,
            }}
            buttonTextStyle={{ textAlign: "left", fontWeight: "600" }}
            dropdownStyle={{ backgroundColor: "white", borderRadius: 7 }}
            data={rooms}
            defaultButtonText={room}
            onSelect={(selectedItem) => {
              setNewRoom(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem) => {
              return selectedItem;
            }}
            rowTextForSelection={(item) => {
              return item;
            }}
          />
        </View>
      </View>
      <View style={styles.buttonField}>
        {loading ? (
          <ActivityIndicator style={styles.loader} size={"large"} />
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={editUser}>
            <Text style={styles.editButtonText}>Ændr oplysninger</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.logOutButton}
        onPress={() => {
          firebase
            .auth()
            .signOut()
            .then(() => props.navigation.navigate("LoginScreen"));
        }}
      >
        <Text style={styles.logOutButtonText}>Log ud</Text>
      </TouchableOpacity>
    </View>
  );
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

  inputContainer: {
    flex: 0.6,
    flexDirection: "column",
    justifyContent: "space-around",
    width: "75%",
  },
  inputField: {
    flex: 0.2,
    justifyContent: "space-between",
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
  inputCaption: {
    fontSize: 16,
    fontWeight: "700",
  },

  buttonField: {
    flex: 0.1,
    width: "75%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  editButton: {
    padding: 15,
    borderRadius: 7,
    backgroundColor: "rgb(187, 36, 25)",
    borderColor: "gray",
    borderWidth: 1,
    alignItems: "center",
  },
  editButtonText: { color: "white", fontSize: 20, fontWeight: "700" },

  logOutButton: {
    flex: 0.05,
    alignItems: "center",
  },
  logOutButtonText: {
    color: "rgb(187, 36, 25)",
    fontSize: 20,
    fontWeight: "700",
  },
});
