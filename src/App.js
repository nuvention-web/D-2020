import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import DoctorView from "./DoctorComponents/DoctorView";
import ExerciseTracking from "./PatientComponents/PatientExerciseTracking";
import PatientExerciseMain from "./PatientComponents/PatientExerciseMain";
import IndividualPatientView from "./DoctorComponents/IndividualPatientView";
import Landing from "./Landing";
import { makeStyles } from "@material-ui/core/styles";
import UserProvider from "./contexts/UserContext";
import Profile from "./Profile/Profile";
import ProfileEdit from "./Profile/ProfileEdit";
import NewUserForm from "./NewUserForm";
import NavBar from "./NavBar";
// Add login/auth logic here, add react routing to correct pages
// React routing flow
// Landing Page (doctor signin and patient signin)
// PatientView
// PateintExerciseMain.js: screen with the week's worth of exercises on it
// PatientExerciseTracking.js: screen for actual exercise section
// DoctorView

const useStyles = makeStyles((theme) => ({
  window: {
    marginTop: "5%",
    height: "100%",
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <UserProvider>
      <Router>
        <NavBar />

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
              component={(props) => (
                <PatientExerciseMain {...props}></PatientExerciseMain>
              )}
            ></Route>
            {/* <Route path="/users">
            <Users />
          </Route> */}
            <Route
              path="/PT/patient/:id"
              component={(props) => (
                <IndividualPatientView {...props}></IndividualPatientView>
              )}
            ></Route>
            <Route
              path="/PT"
              component={(props) => <DoctorView></DoctorView>}
            ></Route>
            <Route
              path="/newUser"
              component={(props) => <NewUserForm />}
            ></Route>
            <Route
              path="/profile/edit"
              component={(...props) => <ProfileEdit />}
            ></Route>
            <Route
              path="/profile"
              component={(...props) => <Profile />}
            ></Route>
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
