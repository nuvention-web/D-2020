import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "firebase/auth";

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
const db = firebase.database().ref();

const SignIn = () => (
  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
);
const LogOut = () => firebase.auth().signOut();

export { db, SignIn, LogOut };
