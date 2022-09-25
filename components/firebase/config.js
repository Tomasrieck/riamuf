// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-iZ0dHM1sar6Wr3QN0ZlbwgZ0fMQHclU",
  authDomain: "riamuf.firebaseapp.com",
  projectId: "riamuf",
  storageBucket: "riamuf.appspot.com",
  messagingSenderId: "732087021588",
  appId: "1:732087021588:web:7cc16243302d2515af3701",
  measurementId: "G-5H3GJ1GR8Y",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
