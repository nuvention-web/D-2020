import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import PatientView from './PatientComponents/PatientView';
import DoctorView from './DoctorComponents/DoctorView';
import ExerciseTracking from './PatientComponents/PatientExerciseTracking';
import PatientExerciseMain from './PatientComponents/PatientExerciseMain';


// Add login/auth logic here, add react routing to correct pages 

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/workout">Workout</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
        <Route path="/workout">
            <ExerciseTracking></ExerciseTracking>
          </Route>
          {/* <Route path="/workout">
            <PatientExerciseMain></PatientExerciseMain>
          </Route> */}
          {/* <Route path="/users">
            <Users />
          </Route> */}
          <Route path="/">
            
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
  // return (
  //   (false) ? 
  //   <DoctorView></DoctorView>
  //   :
  //   <ExerciseTracking></ExerciseTracking>
  // );

export default App;
