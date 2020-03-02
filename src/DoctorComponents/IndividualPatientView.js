import React, {useState, useEffect} from 'react';
import Patient from '../PatientComponents/Patient'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import PatientData from '../ModelJSON/Patients.json'
import { render } from '@testing-library/react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import PresetExercisesData from '../ModelJSON/PresetExercises.json';
import PatientExerciseData from '../ModelJSON/PatientExercises.json';

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
    }, 
    stretchGraphic: {
        height: 225,
        marginLeft: 15,
        marginTop: 55
    },
    exerciseBox: {
        width: 200
    }

}));



const IndividualPatientView = (props) => {
<<<<<<< HEAD

    // useEffect(() => {
    //     try{
    //         const test = props.location.patientProps.patientInfo
    //     }
    //     catch{
    //         props.history.push('/PT')
    //     }
    //   }, []);

    // console.log(props) 
    
    const patientData = props.location.patientProps.patientInfo
=======
    // If patient data does not exist (in case of refresh), retrieve from console
    const [patientData, setPatientData] = useState("");
    useEffect(() => {
        if (props.location.patientProps == undefined) {
            var cpi = localStorage.getItem('currPatient');

            setPatientData(PatientExerciseData[cpi]);
            console.log("patient data retrieved from local storage", patientData);
        }
        else {
            setPatientData(props.location.patientProps.patientInfo)
            localStorage.setItem('currPatient', patientData.id);
        }
    });

 
    // try {
    //     const patientData = props.location.patientProps.patientInfo;
    //     localStorage.setItem('currPatient', patientData.id);
    //  } 
    //  catch(e) { 
    //      const i = localStorage.getItem('currPatient');
    //      const patientData = PatientExerciseData[i];
    //      console.error(e); 
    // }

>>>>>>> 2e14fe96dce708ea3683203d899015047c31b43b
    const classes = useStyles();
    const [patients, setPatient] = useState(PatientData.patients);
    const [newExercise, setNewExercise] = useState("");

<<<<<<< HEAD
=======
    const addExercise = () => {
        console.log("Add this exercise to firebase", newExercise);
    }

>>>>>>> 2e14fe96dce708ea3683203d899015047c31b43b
    return ( 
        <div>
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6">PRM</Typography>
            </Toolbar>
        </AppBar>

        <Container fixed>
            <Typography variant="h4" className={classes.header}>Patient: {patientData.name}</Typography>

        <Link to="/PT" className={classes.link}>
                <Button className={classes.backButton} variant="outline-primary">Back</Button>
        </Link>


        <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select Exercise</Form.Label>
                <Form.Control as="select" 
                    className={classes.exerciseBox} 
                    // onChange={setNewExercise()}
                    inputRef={(ref) => {newExercise = ref}}>
                    {PresetExercisesData.map( (exercise, i) => {
                        return(
                            <option>{exercise.name}</option>
                        );
                    }
                    )}
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className={classes.submitButton} onClick={addExercise()}>
                Add
            </Button>
        </Form>

        </Container>



        
        </div>
    );
}

export default IndividualPatientView;




