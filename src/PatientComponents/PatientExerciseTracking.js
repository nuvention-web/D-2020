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
import YouTube from 'react-youtube';


const useStyles = makeStyles(theme => ({
    exercises: {
        marginTop: 15
    },
    header: {
        marginTop: 10,
        marginBottom: 8,
        color: '#80858a'
    },
    meter: {
        marginTop: 25
    },
    video: {
        marginTop: 30,
        marginLeft: 120,
        height: 250,
        width: 460,
    },
    exerciseContainer: {
        display: 'flex',
        flexDirection: 'row'
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
            <Typography variant="h4" className={classes.header}>Weekly Exercises</Typography>
            <Divider />
            <div className={classes.exerciseContainer}>
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
            <Typography variant="h6" className={classes.meter}>Percent Completed: {percentFinished}%</Typography>
            </FormGroup>
            <YouTube
                videoId="bv373Y1oeck"
                className={classes.video}
            />
            </div>
            </Container>
        </div>
    )
}

export default ExerciseTracking;