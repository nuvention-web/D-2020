import React from 'react';
import './App.css';
import PatientView from './PatientComponents/PatientView';
import DoctorView from './DoctorComponents/DoctorView';
import ExerciseTracking from './PatientComponents/PatientExerciseTracking';
import PatientExerciseMain from './PatientComponents/PatientExerciseMain';


// Add login/auth logic here, add react routing to correct pages 

const App = () => {
  return (
    (false) ? 
    <DoctorView></DoctorView>
    :
    <PatientExerciseMain></PatientExerciseMain>
  );
}

export default App;
