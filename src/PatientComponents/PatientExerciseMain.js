import React, {useState, useEffect} from 'react';
import Patient from '../PatientComponents/Patient'
import PatientExerciseData from '../ModelJSON/PatientExercises.json';
import Container from '@material-ui/core/Container';
import { render } from '@testing-library/react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import YouTube from 'react-youtube';
import { withStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    exercises: {
        marginTop: 15,
        minWidth: 250
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
    checklistContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    appBar: {
        backgroundColor: '#bfd9ff',
        boxShadow: 'none'
    },
    exerciseContainer: {
        marginTop: 30
    },

}));

const calculateTotalTime = () => {
    var t = 0
    for (const [i, entry] of Object.entries(PatientExerciseData.exercise)) {
        t += entry.duration;
      }
    console.log("t:",t)
    return t;
}

const formatExerciseName = (n) => {
    var splitStr = n.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

const PatientExerciseMain = ({startWorkout}) => {
    const [checked, setChecked] = useState(Array(PatientExerciseData.exercise.length).fill(false));
    const [percentFinished, setPercentFinished] = useState(0);
    const classes = useStyles();
    const [totalTime, setTotalTime] = useState(calculateTotalTime);
    
    const handleChecked = (index) => {
        var updatedChecked = [...checked];
        updatedChecked[index] = !updatedChecked[index];
        setChecked(updatedChecked);
        
        var numTrue = checked.filter(Boolean).length;
        setPercentFinished(100*(updatedChecked.reduce((a,b) => a + b, 0)/checked.length));
    }
    
    const StyledButton = withStyles({
        root: {
          background: 'linear-gradient(45deg, #2980B9 50%, #6DD5FA 100%)',
          borderRadius: 3,
          border: 0,
          color: 'white',
          height: 48,
          padding: '0 30px',
          boxShadow: '0 3px 5px 2px #fff',
        },
        label: {
          textTransform: 'capitalize',
        },
      })(Button);

    return(
        <div>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6">PRM</Typography>
                </Toolbar>
            </AppBar>
            <Container className={classes.exerciseContainer}>
            <Typography variant="h4" className={classes.header}>Monday Exercises ({totalTime} minutes)</Typography>
            <StyledButton onClick={()=>startWorkout()} color="primary">Start Workout</StyledButton>
            <Divider />
            <div className={classes.checklistContainer}>
            <FormGroup className={classes.exercise}>
            {PatientExerciseData.exercise.map( (exercise, i) => {
                return(
                    <FormControlLabel
                    key={i}
                    control={
                    <Checkbox 
                        checked={!!checked[i]} 
                        onChange={() => {handleChecked(i)}}
                        color="#7ea8e6"
                        // style={{color: "#7ea8e6"}}
                    />
                    }
                    label={formatExerciseName(exercise.name)}
                    />

                );
            }
            )}
            <Typography variant="h6" className={classes.meter}>Percent Completed: {percentFinished}%</Typography>
            </FormGroup>
            {/* <YouTube
                videoId="bv373Y1oeck"
                className={classes.video}
            /> */}
            </div>
            </Container>
        </div>
    )
}

export default PatientExerciseMain;