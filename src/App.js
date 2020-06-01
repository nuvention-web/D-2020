import React, { useState } from "react";
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
import NavBar from "./NavBar/NavBar";
import Exercises from "./DoctorComponents/Exercises/Exercises";
import Exercise from "./DoctorComponents/Exercises/Exercise";
import ExerciseEdit from "./DoctorComponents/Exercises/ExerciseEdit";
import ExerciseNew from "./DoctorComponents/Exercises/ExerciseNew";
import Templates from "./DoctorComponents/Exercises/Templates";
import TemplateEdit from "./DoctorComponents/Exercises/TemplateEdit";
import ProgressHistory from "./DoctorComponents/ProgressHistory";
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

  //set haveLoggedIn acts as a variable that triggers rerendering of navBar
  const [haveLoggedIn, setHaveLoggedIn] = useState(false);

  return (
    <UserProvider>
      <Router>
        <NavBar haveLoggedIn={haveLoggedIn} setHaveLoggedIn={setHaveLoggedIn} />

        <div className={classes.window}>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route
              exact
              path="/"
              component={() => (
                <Landing
                  haveLoggedIn={haveLoggedIn}
                  setHaveLoggedIn={setHaveLoggedIn}
                />
              )}
            ></Route>
            <Route
              path="/workout/:day"
              component={(props) => (
                <ExerciseTracking {...props}></ExerciseTracking>
              )}
            ></Route>
            <Route
              path="/workout"
              component={() => (
                <PatientExerciseMain
                  haveLoggedIn={haveLoggedIn}
                  setHaveLoggedIn={setHaveLoggedIn}
                ></PatientExerciseMain>
              )}
            ></Route>
            {/* <Route path="/users">
            <Users />
          </Route> */}
            <Route
              path="/PT/patient/history/:id"
              component={(props) => (
                <ProgressHistory {...props}></ProgressHistory>
              )}
            ></Route>
            <Route
              exact
              path="/PT/patient/:id"
              component={(props) => (
                <IndividualPatientView {...props}></IndividualPatientView>
              )}
            ></Route>
            <Route
              exact
              path="/PT/exercises/templates"
              component={(props) => <Templates {...props}></Templates>}
            ></Route>
            <Route
              path="/PT/exercises/templates/:id"
              component={(props) => <TemplateEdit {...props}></TemplateEdit>}
            ></Route>
            <Route
              path="/PT/exercises/new"
              component={(props) => <ExerciseNew {...props}></ExerciseNew>}
            ></Route>
            <Route
              path="/PT/exercises/:id"
              component={(props) => <ExerciseEdit {...props}></ExerciseEdit>}
            ></Route>
            <Route
              path="/PT/exercises"
              component={(props) => <Exercises {...props}></Exercises>}
            ></Route>
            <Route
              path="/PT"
              component={() => (
                <DoctorView
                  haveLoggedIn={haveLoggedIn}
                  setHaveLoggedIn={setHaveLoggedIn}
                ></DoctorView>
              )}
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
              component={() => (
                <Profile
                  haveLoggedIn={haveLoggedIn}
                  setHaveLoggedIn={setHaveLoggedIn}
                ></Profile>
              )}
            ></Route>
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
