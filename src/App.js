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
import IndividualPatientView from './DoctorComponents/IndividualPatientView';

// Add login/auth logic here, add react routing to correct pages 
// React routing flow
  // Landing Page (doctor signin and patient signin)
    // PatientView
      // PateintExerciseMain.js: screen with the week's worth of exercises on it 
        // PatientExerciseTracking.js: screen for actual exercise section 
    // DoctorView 
      
const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Landing Page</Link>
            </li>
            <li>
              <Link to="/PT">PT View</Link>
            </li>
            <li>
              <Link to="/workout">Patient View</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/workout/dotw" component={(props)=><ExerciseTracking {...props}></ExerciseTracking>}></Route>
          <Route path="/workout" component={(props)=><PatientExerciseMain></PatientExerciseMain>}></Route>
          {/* <Route path="/users">
            <Users />
          </Route> */}
          <Route path="/PT/patient" component={(props)=><IndividualPatientView></IndividualPatientView>}></Route>
          <Route path="/PT" component={(props)=><DoctorView></DoctorView>}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
