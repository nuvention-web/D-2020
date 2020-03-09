import React, { useState, useEffect } from 'react';
import Patient from '../PatientComponents/Patient'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import PatientData from '../ModelJSON/Patients.json'
import { render } from '@testing-library/react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'react-bootstrap/Button';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import IndividualPatientView from './IndividualPatientView';
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
    blueButton: {
        backgroundColor: "#9DB4FF",
        border: "none",
        height: "calc(1.5em + .75rem + 2px)"
    },
    patientInfoCard: {
        width: 300,
        minHeight: 430,
        margin: 10
    },
    accentDivider: {
        content: "",
        display: "block",
        width: "6.25rem",
        height: ".325rem",
        marginTop: "1.5rem",
        background: "#9DB4FF"
      }
}));


const DoctorView = () => {
    const classes = useStyles();
    const [patients, setPatient] = useState(PatientData.patients);
    const patientData = PatientExerciseData;
    console.log("patientData", patientData);

    return (
        <div>
            <Container fixed>
                <Link to="/" className={classes.link}>
                    <Button className={classes.blueButton} variant="outline-primary">Back</Button>
                </Link>
                <Typography variant="h4" className={classes.header}>Patient Dashboard</Typography>
                <div className={classes.accentDivider}></div>

                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={1}
                >
                    {patientData.map((p, i) => {
                        return (
                            <Link to={{
                                pathname: "/PT/patient",
                                patientProps: { patientInfo: p }
                            }}
                                className={classes.link}
                            >
                                <div>
                                    <Grid item className={classes.patientInfoCard} key={i}>
                                        <Patient
                                            name={p.name}
                                            photo={p.photo}
                                            profile={p.profile}
                                        />
                                    </Grid>
                                </div>
                            </Link>)
                    })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default DoctorView;




