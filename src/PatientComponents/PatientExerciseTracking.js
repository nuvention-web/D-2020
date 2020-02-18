import React, {useState, useEffect} from 'react';
import Patient from '../PatientComponents/Patient'
import PatientExerciseData from '../ModelJSON/PatientExercises.json';
import Container from '@material-ui/core/Container';
import { render } from '@testing-library/react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles(theme => ({
    exercises: {
        marginTop: 15
    }

}));


const ExerciseTracking = () => {
    const [checked, setChecked] = useState(Array(PatientExerciseData.exercises.length).fill(false));
    const [percentFinished, setPercentFinished] = useState(0);
    const classes = useStyles();
    
    const handleChecked = (index) => {
        var updatedChecked = [...checked];
        updatedChecked[index] = !updatedChecked[index];
        setChecked(updatedChecked);
        
        var numTrue = checked.filter(Boolean).length;
        setPercentFinished(100*(updatedChecked.reduce((a,b) => a + b, 0)/checked.length));
    }
    
    return(
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">PRM</Typography>
                </Toolbar>
            </AppBar>
            <Container>
            <h2>Weekly Exercises</h2>
            <Divider />
            <FormGroup className={classes.exercises}>
            {PatientExerciseData.exercises.map( (exercise, i) => {
                return(
                    <FormControlLabel
                    key={i}
                    control={
                    <Checkbox 
                        checked={!!checked[i]} 
                        onChange={() => {handleChecked(i)}}
                        color="primary"/>
                    }
                    label={exercise}
                    />

                );
            }
            )}
            </FormGroup>
            <h4>Percent Completed: {percentFinished}%</h4>
            </Container>
        </div>
    )
}

export default ExerciseTracking;