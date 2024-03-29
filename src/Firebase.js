import React from "react";
// import firebase from "firebase/app";
import "firebase/database";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "firebase/auth";
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHfqEdRxQ-wMpv99CjH9lRUIGOd6h6EOs",
  authDomain: "nuvention-team-d.firebaseapp.com",
  databaseURL: "https://nuvention-team-d.firebaseio.com",
  projectId: "nuvention-team-d",
  storageBucket: "nuvention-team-d.appspot.com",
  messagingSenderId: "928624394684",
  appId: "1:928624394684:web:3b85b8f7ebaee7c96a6bb9",
  measurementId: "G-L0DZ5FW3JH",
};

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

firebase.initializeApp(firebaseConfig);
// Previously using RTD
// const db = firebase.database().ref();

// Using firestore
const db = firebase.firestore();
const storageRef = firebase.storage().ref();

const SignIn = () => (
  <div style={{ marginTop: "90px" }}>
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  </div>
);
const LogOut = () => {
  localStorage.setItem("type", "");
  firebase.auth().signOut();
};

export { db, SignIn, LogOut, storageRef, firebase };
