import React from 'react';
import './App.css';
import PatientView from './PatientComponents/PatientView' 
import DoctorView from './DoctorComponents/DoctorView' 

// Add login/auth logic here, add react routing to correct pages 

const App = () => {
  return ( 
    (false) ? 
    <PatientView></PatientView>
    :
    <DoctorView> </DoctorView>
  );
}

export default App;
