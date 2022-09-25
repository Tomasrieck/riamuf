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

export const Calendar = () => {
  const hoursRef = firebase.firestore().collection("Øvelokale 3");
  const usersRef = firebase.firestore().collection("Users");
  const [hours, setHours] = useState([]);
  const user = [];
  const [chosenUserId, setChosenUserId] = useState([]);
  const [chosenUserName, setChosenUserName] = useState(null);
  const [chosenBookedHours, setChosenBookedHours] = useState(null);
  const chosenHour = [];
  const [date] = useState(new Date());
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [popUpVisible, setPopUpVisible] = useState(false);

  const days = [
    "Søndag",
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
  ];
  const months = [
    "Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  const row1 = ["07:00", "07:30", "08:00", "08:30"];
  const row2 = ["09:00", "09:30", "10:00", "10:30"];
  const row3 = ["11:00", "11:30", "12:00", "12:30"];
  const row4 = ["13:00", "13:30", "14:00", "14:30"];
  const row5 = ["15:00", "15:30", "16:00", "16:30"];
  const row6 = ["17:00", "17:30", "18:00", "18:30"];
  const row7 = ["19:00", "19:30", "20:00", "20:30"];
  const row8 = ["21:00", "21:30", "22:00", "22:30"];

  const hoursQueryRef = hoursRef
    .where("Year", "==", date.getFullYear().toString())
    .where("Month", "==", months[date.getMonth()].toString())
    .where("Day", "==", date.getDate().toString());
  const userQueryRef = hoursRef.where(
    "UserId",
    "==",
    firebase.auth().currentUser.uid
  );

  const BookingPopUp = () => {
    const chosenUserRef = usersRef.where("UserId", "==", chosenUserId);
    chosenUserRef.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { Name } = doc.data();
        user.push({
          Name,
        });
        user.map((item) => {
          setChosenUserName(item.Name);
        });
        if (chosenUserName != null) {
          setUserLoading(false);
        }
      });
    });

    return (
      <View style={styles.popUpScreen}>
        <View style={styles.popUp}>
          {userLoading ? (
            <ActivityIndicator
              size="large"
              color="gray"
              style={styles.userLoader}
            />
          ) : (
            <View style={styles.popUpText}>
              <View style={styles.popUpTextfield}>
                <Text style={styles.text}>Booket af: </Text>
                <Text style={styles.text}>{chosenUserName}</Text>
              </View>
              <View style={styles.popUpTextfield}>
                <Text style={styles.text}>Øver i tidsrummet: </Text>
                <Text style={styles.text}>
                  {chosenBookedHours[0]} -{" "}
                  {chosenBookedHours[chosenBookedHours.length - 1]}
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            style={styles.popUpButton}
            onPress={() => {
              setPopUpVisible(false);
              setChosenUserName(null);
              setUserLoading(true);
            }}
          >
            <Text style={styles.buttonText}>Luk</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  function tomorrow() {
    setLoading(true);
    setHours([]);
    date.setDate(date.getDate() + 1);
    setToggleUpdate(true);
  }
  function yesterday() {
    setLoading(true);
    setHours([]);
    date.setDate(date.getDate() - 1);
    setToggleUpdate(true);
  }

  function getUserId(hour) {
    const chosenHourRef = hoursQueryRef.where(
      "BookedHours",
      "array-contains",
      hour
    );
    chosenHourRef.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { UserId, BookedHours } = doc.data();
        chosenHour.push({
          UserId,
          BookedHours,
        });
        setChosenUserId(chosenHour[0].UserId);
        setChosenBookedHours(BookedHours);
      });
    });
  }

  function createBooking(startHour) {
    var selectedHours = [startHour];
    firebase.firestore().collection("Øvelokale 3").add({
      UserId: firebase.auth().currentUser.uid,
      BookedHours: selectedHours,
      Year: date.getFullYear().toString(),
      Month: months[date.getMonth()].toString(),
      Day: date.getDate().toString(),
    });
    setLoading(false);
  }

  const RenderHour = (props) => {
    var checkedHours = [];
    for (let i = 0; i < props.rowNum.length; i++) {
      if (hours.some((row) => row.BookedHours.includes(props.rowNum[i]))) {
        checkedHours.push(
          <TouchableOpacity
            style={styles.hourBooked}
            key={i}
            onPress={() => {
              getUserId(props.rowNum[i].toString());
              setPopUpVisible(true);
            }}
          >
            <Text style={styles.hourBookedText}>{props.rowNum[i]}</Text>
          </TouchableOpacity>
        );
      } else {
        checkedHours.push(
          <TouchableOpacity
            style={styles.hourAvail}
            key={i}
            onPress={() => createBooking(props.rowNum[i].toString())}
          >
            <Text style={styles.hourAvailText}>{props.rowNum[i]}</Text>
          </TouchableOpacity>
        );
      }
    }
    return <>{checkedHours}</>;
  };

  useEffect(() => {
    hoursQueryRef.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { UserId, BookedHours } = doc.data();
        hours.push({
          UserId,
          BookedHours,
        });
      });
      if (hours != []) {
        setLoading(false);
      }
      console.log(hours);
    });
    setToggleUpdate(false);
  }, [toggleUpdate]);

  return (
    <View style={styles.container}>
      <View style={styles.datePicker}>
        <TouchableOpacity onPress={yesterday}>
          <AntDesign name="left" size={27} color="rgb(187, 36, 25)" />
        </TouchableOpacity>
        <View style={styles.date}>
          <Text style={styles.text}>{days[date.getDay()]} </Text>
          <Text style={styles.text}>{date.getDate()}. </Text>
          <Text style={styles.text}>{months[date.getMonth()]} </Text>
          <Text style={styles.text}>{date.getFullYear()}</Text>
        </View>
        <TouchableOpacity onPress={tomorrow}>
          <AntDesign name="right" size={27} color="rgb(187, 36, 25)" />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <View style={styles.line} />
        <Text style={styles.text}>Vælg start for øver</Text>
        <View style={styles.line} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="gray" style={styles.loader} />
      ) : (
        <View style={styles.schedule}>
          <View style={styles.row}>
            <RenderHour rowNum={row1} />
          </View>
          <View style={styles.row}>
            <RenderHour rowNum={row2} />
          </View>
          <View style={styles.row}>
            <RenderHour rowNum={row3} />
          </View>
          <View style={styles.row}>
            <RenderHour rowNum={row4} />
          </View>
          <View style={styles.row}>
            <RenderHour rowNum={row5} />
          </View>
          <View style={styles.row}>
            <RenderHour rowNum={row6} />
          </View>
          <View style={styles.row}>
            <RenderHour rowNum={row7} />
          </View>
          <View style={styles.row}>
            <RenderHour rowNum={row8} />
          </View>
        </View>
      )}
      {popUpVisible == true && <BookingPopUp />}
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
  text: {
    fontSize: 17,
    fontWeight: "600",
  },
  datePicker: {
    flex: 0.1,
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    flexDirection: "row",
  },

  header: {
    width: "98%",
    flex: 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    color: "red",
  },
  line: {
    flex: 0.4,
    height: 1,
    backgroundColor: "rgb(187, 36, 25)",
  },

  schedule: {
    flex: 0.8,
    width: "90%",
    justifyContent: "space-around",
  },
  row: {
    flex: 0.07,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  hourAvail: {
    flex: 0.22,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "limegreen",
    borderWidth: 2.4,
    borderRadius: 50,
  },
  hourBooked: {
    flex: 0.22,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "lightgray",
    borderWidth: 2.4,
    borderRadius: 50,
  },
  hourAvailText: {
    color: "limegreen",
    fontWeight: "700",
  },
  hourBookedText: {
    color: "lightgray",
    fontWeight: "700",
  },
  loader: {
    flex: 0.8,
  },

  popUpScreen: {
    height: "100%",
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
    justifyContent: "space-between",
    flex: 0.47,
  },
  popUpTextfield: {
    justifyContent: "space-between",
    flex: 0.4,
  },
  popUpButton: {
    flex: 0.2,
    width: 100,
    backgroundColor: "rgb(187, 36, 25)",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  userLoader: {
    flex: 0.2,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 17,
    color: "white",
  },
});
