import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import PatientView from "./PatientComponents/PatientView";
import DoctorView from "./DoctorComponents/DoctorView";
import ExerciseTracking from "./PatientComponents/PatientExerciseTracking";
import PatientExerciseMain from "./PatientComponents/PatientExerciseMain";
import IndividualPatientView from "./DoctorComponents/IndividualPatientView";
import Landing from "./Landing";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "react-bootstrap/Button";
import Toolbar from "@material-ui/core/Toolbar";
import UserProvider from "./contexts/UserContext";
import firebase from "firebase/app";

// Add login/auth logic here, add react routing to correct pages
// React routing flow
// Landing Page (doctor signin and patient signin)
// PatientView
// PateintExerciseMain.js: screen with the week's worth of exercises on it
// PatientExerciseTracking.js: screen for actual exercise section
// DoctorView

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "white",
    boxShadow: "none",
    height: 100,
    display: "inline-block",
  },
  appBackground: {
    backgroundColor: "#FEFEFE",
    height: "100vh",
  },
  tendonLogo: {
    width: 150,
    float: "left",
    display: "inline-block",
    margin: "25px 30px",
  },
  navBar: {
    float: "right",
    width: "70vh",
    justifyContent: "center",
    margin: "20px 0px",
  },
  navButton: {
    display: "inline-block",
    margin: "0px 10px",
    fontSize: 14,
    backgroundColor: "inherit",
    border: "none",
    // fontFamily: "San Francisco",
    "&:hover": {
      color: "#9DB4FF",
      backgroundColor: "inherit",
    },
  },
  accentDivider: {
    content: "",
    display: "block",
    width: "6.25rem",
    height: ".325rem",
    marginTop: "1.5rem",
    background: "#9DB4FF",
  },
  window: {
    height: "100%",
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <UserProvider>
      <Router>
        <div className={classes.window}>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}

          <Switch>
            <Route exact path="/" component={(props) => <Landing />}></Route>
            <Route
              path="/workout/dotw"
              component={(props) => (
                <ExerciseTracking {...props}></ExerciseTracking>
              )}
            ></Route>
            <Route
              path="/workout"
              component={(props) => <PatientExerciseMain></PatientExerciseMain>}
            ></Route>
            {/* <Route path="/users">
            <Users />
          </Route> */}
            <Route
              path="/PT/patient"
              component={(props) => (
                <IndividualPatientView {...props}></IndividualPatientView>
              )}
            ></Route>
            <Route
              path="/PT"
              component={(props) => <DoctorView></DoctorView>}
            ></Route>
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
