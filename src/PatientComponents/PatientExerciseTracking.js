import React, {useState, useEffect} from 'react';
import Patient from '../PatientComponents/Patient'
import PatientExerciseData from '../ModelJSON/PatientExercises.json';
import Container from '@material-ui/core/Container';
import { render } from '@testing-library/react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';



const ExerciseTracking = () => {
    const [checked, setChecked] = useState(Array(PatientExerciseData.exercises.length).fill(false));
    const [percentFinished, setPercentFinished] = useState(0);
    
    const handleChecked = (index) => {
        var updatedChecked = [...checked];
        updatedChecked[index] = !updatedChecked[index];
        setChecked(updatedChecked);
        
        var numTrue = checked.filter(Boolean).length;
        console.log('num true', numTrue);
        setPercentFinished(100*(updatedChecked.reduce((a,b) => a + b, 0)/checked.length));
    }
    
    return(
        <Container>
            <h2>Weekly Exercises</h2>
            <FormGroup>
            {PatientExerciseData.exercises.map( (exercise, i) => 
                <FormControlLabel
                key={i}
                control={
                  <Checkbox checked={!!checked[i]} onChange={() => {handleChecked(i)}}/>
                }
                label={exercise}
              />
            )}
            </FormGroup>
            <h4>Percent Completed: {percentFinished}%</h4>
        </Container>
    )
}

export default ExerciseTracking;