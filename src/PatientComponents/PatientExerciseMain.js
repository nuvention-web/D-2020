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
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import ExerciseTracking from './PatientExerciseTracking';
// import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


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
      
    },
    appBar: {
        backgroundColor: '#bfd9ff',
        boxShadow: 'none'
    },
    exerciseContainer: {
        marginTop: 30
    },
    link: {
        textDecoration: 'none',
        textAlign: 'right',
        '&:hover': {
            color: 'white'
         },
    },
    startButton: {
        float: 'right'
    }    


}));

const calculateTotalTime = (s) => {
    var t = 0
    console.log("set", s)
    console.log("set.exercise", s.exercise);
    for (const [i, entry] of Object.entries(s.exercise)) {
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

const PatientExerciseMain = () => {
    const exerciseSets = PatientExerciseData.sets
    const [percentFinished, setPercentFinished] = useState(0);
    const classes = useStyles();
    
    // const handleChecked = (index) => {
    //     var updatedChecked = [...checked];
    //     updatedChecked[index] = !updatedChecked[index];
    //     setChecked(updatedChecked);
        
    //     var numTrue = checked.filter(Boolean).length;
    //     setPercentFinished(100*(updatedChecked.reduce((a,b) => a + b, 0)/checked.length));
    // }
    
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



    //   <Container className={classes.exerciseContainer}>
    //   <Typography variant="h4" className={classes.header}>Monday Exercises ({totalTime} minutes)</Typography>
    //   <StyledButton onClick={()=>startWorkout()} color="primary">Start Workout</StyledButton>
    //   <Divider />
    //   <div className={classes.checklistContainer}>
    //   <FormGroup className={classes.exercise}>
    return(
        <div>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6">PRM</Typography>
                </Toolbar>
            </AppBar>

            {exerciseSets.map( (set, i) => {
                return(
                <Container className={classes.exerciseContainer} key={i}>
                <Typography variant="h4" className={classes.header}>{set.day} Exercises ({calculateTotalTime(set)} minutes)
                    <Link to= {{
                        pathname: "/workout/dotw",
                        patientProps: {currentSet: set}
                    }}
                        className={classes.link}
                    >
                        <Button className={classes.startButton} variant="outline-primary">Start</Button>
                    </Link>
                </Typography>
                <div className={classes.checklistContainer}>
                <Row>
                    <Col>Exercise</Col>
                    <Col>Reps</Col>
                    <Col>Duration</Col>
                </Row>
                <Divider />
                    {set.exercise.map( (exercise, i) => {
                        return(
                            <Row key={i}>
                                <Col>{formatExerciseName(exercise.name)}</Col>
                                <Col>{exercise.reps}</Col>
                                <Col>{exercise.duration}</Col>
                            </Row>
                        );
                    }
                    )}
               
            </div>


            </Container>
             );
            }
            )}
        </div>
    )
}

export default PatientExerciseMain;