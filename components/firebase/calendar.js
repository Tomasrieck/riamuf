import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "./config";
import { userRoom } from "./login";
import {
  days,
  months,
  row1,
  row2,
  row3,
  row4,
  row5,
  row6,
  row7,
  row8,
} from "../calendarUtils";

import { AntDesign } from "@expo/vector-icons";

export const Calendar = () => {
  const currentUserRoom = userRoom;
  const usersRef = firebase.firestore().collection("Users");
  const hoursRef = firebase.firestore().collection(currentUserRoom);
  const [hours, setHours] = useState([]);
  const user = [];
  const [chosenUserId, setChosenUserId] = useState([]);
  const [chosenBookedHours, setChosenBookedHours] = useState(null);
  const chosenHour = [];
  var availHours = [];
  var bookedHours = [];
  const [startHour, setStartHour] = useState();
  const [date] = useState(new Date());
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [bookingPopUpVisible, setBookingPopUpVisible] = useState(false);
  const [createPopUpVisible, setCreatePopUpVisible] = useState(false);

  const hoursQueryRef = hoursRef
    .where("Year", "==", date.getFullYear().toString())
    .where("Month", "==", months[date.getMonth()].toString())
    .where("Day", "==", date.getDate().toString());

  const BookingPopUp = () => {
    const chosenUserRef = usersRef.where("UserId", "==", chosenUserId);
    const [chosenUserName, setChosenUserName] = useState(null);
    const [chosenUserMobile, setChosenUserMobile] = useState();

    chosenUserRef.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { Name, Mobile } = doc.data();
        user.push({
          Name,
          Mobile,
        });
        user.map((item) => {
          setChosenUserName(item.Name);
          setChosenUserMobile(item.Mobile);
        });
        if (chosenUserName != null) {
          setUserLoading(false);
        }
      });
    });

    function deleteHours() {
      firebase
        .firestore()
        .collection(currentUserRoom)
        .where("UserId", "==", chosenUserId)
        .where("BookedHours", "==", chosenBookedHours)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            firebase
              .firestore()
              .collection(currentUserRoom)
              .doc(doc.id)
              .delete()
              .then(() => {
                setHours([]);
                setLoading(true);
                setToggleUpdate(true);
                setBookingPopUpVisible(false);
                console.log("Øver slettet");
              });
          });
        });
    }

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
                <Text style={styles.text}>{chosenUserName},</Text>
                <Text style={styles.text}>Tlf. {chosenUserMobile}</Text>
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
          {chosenUserId == firebase.auth().currentUser.uid ? (
            <View style={styles.deletePopUpButtonField}>
              <TouchableOpacity
                style={styles.createPopUpButtonClose}
                onPress={() => {
                  setBookingPopUpVisible(false);
                  setChosenUserName(null);
                  setUserLoading(true);
                }}
              >
                <Text style={styles.buttonText2}>Luk</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createPopUpButtonAdd}
                onPress={deleteHours}
              >
                <Text style={styles.buttonText}>Slet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.popUpButton}
              onPress={() => {
                setBookingPopUpVisible(false);
                setChosenUserName(null);
                setUserLoading(true);
              }}
            >
              <Text style={styles.buttonText}>Luk</Text>
            </TouchableOpacity>
          )}
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

  const CreateBooking = () => {
    const [chosen, setChosen] = useState(null);
    const selectedHours = [];
    var possibleHours = [];
    var filteredBookedHours = bookedHours.filter((item) => startHour < item);

    for (let i = 0; i < availHours.length; i++) {
      if (filteredBookedHours.length == 0 && availHours[i] > startHour) {
        possibleHours.push(availHours[i]);
      } else if (
        availHours[i] > startHour &&
        availHours[i] < filteredBookedHours[0]
      ) {
        possibleHours.push(availHours[i]);
      }
    }
    for (let i = 0; i < filteredBookedHours.length; i++) {
      if (startHour < filteredBookedHours[i]) {
        possibleHours.push(filteredBookedHours[i]);
        break;
      }
    }
    if (possibleHours[possibleHours.length - 1] == "22:30") {
      possibleHours.push("23:00");
    }
    if (startHour == "22:30") {
      possibleHours.push("23:00");
    }

    function addHours() {
      firebase
        .firestore()
        .collection(currentUserRoom)
        .add({
          UserId: firebase.auth().currentUser.uid,
          BookedHours: selectedHours,
          Year: date.getFullYear().toString(),
          Month: months[date.getMonth()].toString(),
          Day: date.getDate().toString(),
        })
        .then(() => {
          setHours([]);
          setLoading(true);
          setToggleUpdate(true);
          setCreatePopUpVisible(false);
        });
    }

    useEffect(() => {
      if (chosen != null) {
        let i = 0;
        while (possibleHours[i] <= possibleHours[chosen]) {
          selectedHours.push(possibleHours[i]);
          i++;
        }
        console.log(selectedHours);
      }
    }, [chosen]);

    return (
      <View style={styles.popUpScreen}>
        <View style={styles.createPopUp}>
          <View style={styles.createPopUpText}>
            <Text style={styles.text}>Øver fra {startHour} til:</Text>
          </View>
          <View style={styles.wheelPicker}>
            <ScrollView>
              {possibleHours.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={[
                      chosen == index
                        ? styles.chosenWheelOption
                        : styles.wheelOption,
                    ]}
                    key={index}
                    onPress={() => setChosen(index)}
                  >
                    <Text
                      style={[
                        chosen == index
                          ? styles.chosenWheelOptionText
                          : styles.wheelOptionText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.popUpButtonField}>
            <TouchableOpacity
              style={styles.createPopUpButtonClose}
              onPress={() => {
                setCreatePopUpVisible(false);
              }}
            >
              <Text style={styles.buttonText2}>Luk</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createPopUpButtonAdd}
              onPress={addHours}
            >
              <Text style={styles.buttonText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const RenderHour = (props) => {
    var checkedHours = [];
    for (let i = 0; i < props.rowNum.length; i++) {
      if (
        hours.some(
          (row) =>
            row.BookedHours.includes(props.rowNum[i]) &&
            row.UserId != firebase.auth().currentUser.uid
        )
      ) {
        bookedHours.push(props.rowNum[i]);
        checkedHours.push(
          <TouchableOpacity
            style={styles.hourBooked}
            key={i}
            onPress={() => {
              getUserId(props.rowNum[i].toString());
              setBookingPopUpVisible(true);
            }}
          >
            <Text style={styles.hourBookedText}>{props.rowNum[i]}</Text>
          </TouchableOpacity>
        );
      } else if (
        hours.some(
          (row) =>
            row.BookedHours.includes(props.rowNum[i]) &&
            row.UserId == firebase.auth().currentUser.uid
        )
      ) {
        bookedHours.push(props.rowNum[i]);
        checkedHours.push(
          <TouchableOpacity
            style={styles.myHourBooked}
            key={i}
            onPress={() => {
              getUserId(props.rowNum[i].toString());
              setBookingPopUpVisible(true);
            }}
          >
            <Text style={styles.myHourBookedText}>{props.rowNum[i]}</Text>
          </TouchableOpacity>
        );
      } else {
        availHours.push(props.rowNum[i]);
        checkedHours.push(
          <TouchableOpacity
            style={styles.hourAvail}
            key={i}
            onPress={() => {
              setStartHour(props.rowNum[i]);
              setCreatePopUpVisible(true);
            }}
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
        const { BookedHours, UserId } = doc.data();
        hours.push({
          BookedHours,
          UserId,
        });
      });
      hours.map((item) => {
        item.BookedHours.pop(item.BookedHours.length);
      });
      if (hours != []) {
        setLoading(false);
      }
    });
    setToggleUpdate(false);
  }, [toggleUpdate]);

  return (
    <View style={styles.container}>
      <View style={styles.datePicker}>
        {date.getDate() == new Date().getDate() ? (
          <View style={{ flex: 0.25 }} />
        ) : (
          <TouchableOpacity onPress={yesterday}>
            <AntDesign name="left" size={27} color="rgb(187, 36, 25)" />
          </TouchableOpacity>
        )}
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
        <Text style={styles.text}>Vælg starttid for øver</Text>
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
      {bookingPopUpVisible == true && <BookingPopUp />}
      {createPopUpVisible == true && <CreateBooking />}
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
  myHourBooked: {
    flex: 0.22,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "deepskyblue",
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
  myHourBookedText: {
    color: "deepskyblue",
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
    height: 210,
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
    flex: 0.6,
  },
  popUpTextfield: {
    justifyContent: "center",
    flex: 0.5,
  },
  popUpButton: {
    flex: 0.2,
    width: 120,
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

  createPopUp: {
    height: 320,
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
  createPopUpText: {
    justifyContent: "flex-end",
    flex: 0.07,
  },
  wheelPicker: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.6,
    width: "70%",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 7,
    borderColor: "black",
    borderWidth: 1,
  },
  wheelOption: {
    borderRadius: 7,
    padding: 4,
    marginVertical: 4,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    width: "50%",
    alignItems: "center",
  },
  chosenWheelOption: {
    borderRadius: 7,
    padding: 4,
    marginVertical: 4,
    alignSelf: "center",
    backgroundColor: "rgb(187, 36, 25)",
    width: "50%",
    alignItems: "center",
  },
  wheelOptionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  chosenWheelOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  popUpButtonField: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "97%",
    flex: 0.12,
  },
  createPopUpButtonClose: {
    flex: 0.3,
    width: 120,
    backgroundColor: "white",
    borderColor: "rgb(187, 36, 25)",
    borderWidth: 2,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  createPopUpButtonAdd: {
    flex: 0.3,
    width: 120,
    backgroundColor: "rgb(187, 36, 25)",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText2: {
    fontWeight: "700",
    fontSize: 17,
    color: "rgb(187, 36, 25)",
  },
  deletePopUpButtonField: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "87%",
    flex: 0.17,
  },
});
