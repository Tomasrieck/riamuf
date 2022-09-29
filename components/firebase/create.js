import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { firebase } from "./config";

import { AntDesign } from "@expo/vector-icons";

export const Create = (props) => {
  const [name, setName] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState(null);
  const [room, setRoom] = useState(null);
  const [secretKey, setSecretKey] = useState(null);
  const rooms = ["Øvelokale 1", "Øvelokale 2", "Øvelokale 3"];
  const [loading, setLoading] = useState(false);
  const [takenPopUpVisible, setTakenPopUpVisible] = useState(false);
  const [invalidPopUpVisible, setInvalidPopUpVisible] = useState(false);
  const [buttonCheck, setButtonCheck] = useState(true);

  function createUser() {
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .firestore()
          .collection("Users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            UserId: firebase.auth().currentUser.uid,
            Name: name,
            Mobile: mobile,
            Email: email,
            Room: room,
          })
          .then(() => {
            setLoading(false);
            props.navigation.navigate("Home");
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Fejl", "Email er allerede i brug.", [{ text: "OK" }]);
          console.log("Email er allerede i brug.");
        }

        if (error.code === "auth/invalid-email") {
          Alert.alert("Fejl", "Email er ikke tastet korrekt.", [
            { text: "OK" },
          ]);
          console.log("Email er ikke tastet korrekt.");
        }
      });
  }

  const EmailTakenPopUp = () => {
    return (
      <View style={styles.popUpScreen}>
        <View style={styles.popUp}>
          <View style={styles.popUpText}>
            <Text style={styles.text}>Denne mail er allerede i brug.</Text>
          </View>
          <TouchableOpacity
            style={styles.popUpButton}
            onPress={() => setTakenPopUpVisible(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const InvalidEmailPopUp = () => {
    return (
      <View style={styles.popUpScreen}>
        <View style={styles.popUp}>
          <View style={styles.popUpText}>
            <Text style={styles.text}>
              Denne mail er ugylig. Prøv en anden.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.popUpButton}
            onPress={() => setInvalidPopUpVisible(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (
      name != null &&
      mobile != null &&
      room != null &&
      email != null &&
      password != null &&
      passwordCheck == password &&
      secretKey == "mojn6760"
    ) {
      setButtonCheck(false);
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Fulde navn..."
          autoCorrect={false}
          maxLength={25}
        />
        <TextInput
          style={styles.input}
          onChangeText={setMobile}
          value={mobile}
          placeholder="Mobil..."
          autoCorrect={false}
          maxLength={8}
        />
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
          defaultButtonText="Vælg øvelokale"
          onSelect={(selectedItem) => {
            setRoom(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem) => {
            return selectedItem;
          }}
          rowTextForSelection={(item) => {
            return item;
          }}
        />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email..."
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password..."
          autoCapitalize="none"
          secureTextEntry={true}
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          onChangeText={setPasswordCheck}
          value={passwordCheck}
          placeholder="Gentag password..."
          autoCapitalize="none"
          secureTextEntry={true}
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          onChangeText={setSecretKey}
          value={secretKey}
          placeholder="Hemmelig kode..."
          autoCapitalize="none"
          secureTextEntry={true}
          autoCorrect={false}
        />
      </View>

      <View style={styles.buttonField}>
        {loading ? (
          <ActivityIndicator style={styles.loader} size={"large"} />
        ) : (
          <TouchableOpacity
            style={[
              buttonCheck
                ? styles.invalidCreateButton
                : styles.validCreateButton,
            ]}
            onPress={createUser}
            disabled={buttonCheck}
          >
            <Text style={styles.createButtonText}>Opret Bruger</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Tilbage</Text>
        </TouchableOpacity>
      </View>
      {takenPopUpVisible == true && <EmailTakenPopUp />}
      {invalidPopUpVisible == true && <InvalidEmailPopUp />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  backButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "rgb(187, 36, 25)",
    fontSize: 20,
    fontWeight: "700",
  },

  inputContainer: {
    flex: 0.666,
    flexDirection: "column",
    justifyContent: "space-between",
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
    flex: 0.15,
    width: "75%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  validCreateButton: {
    padding: 15,
    borderRadius: 7,
    backgroundColor: "rgb(187, 36, 25)",
    borderColor: "gray",
    borderWidth: 1,
    alignItems: "center",
  },
  invalidCreateButton: {
    padding: 15,
    borderRadius: 7,
    backgroundColor: "gray",
    borderColor: "gray",
    borderWidth: 1,
    alignItems: "center",
  },
  createButtonText: { color: "white", fontSize: 20, fontWeight: "700" },

  popUpScreen: {
    height: "75%",
    width: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  popUp: {
    height: 200,
    width: 300,
    borderRadius: 7,
    borderColor: "rgb(170,170,170)",
    borderWidth: 1,
    backgroundColor: "whitesmoke",
    shadowColor: "rgb(0,0,0)",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.87,
    shadowRadius: 11,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  popUpText: {
    justifyContent: "center",
    flex: 0.1,
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
  },
  popUpButton: {
    flex: 0.2,
    width: 100,
    backgroundColor: "rgb(187, 36, 25)",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 17,
    color: "white",
  },
});
