import React, {useState, useEffect} from 'react';
import PatientExerciseMain from '../PatientComponents/PatientExerciseMain'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import { render } from '@testing-library/react';


const startWorkout = () => {
    console.log('workout started')
    
}

const PatientView = () => {
    return ( 
        <Container fixed>
            <PatientExerciseMain startWorkout={startWorkout}></PatientExerciseMain>
        </Container>
    );
}

export default PatientView;

