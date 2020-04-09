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
import AppBar from "@material-ui/core/AppBar";
import { db } from "../Firebase.js";



const useStyles = makeStyles(theme => ({
    appBar: {
        backgroundColor: "transparent",
        boxShadow: "none",
        height: 100,
        display: "inline-block",
    },
    tendonLogo: {
        width: 150,
        float: "left",
        display: "inline-block",
        margin: "40px 30px",
    },
    exercises: {
        marginTop: 15,
        minWidth: 250
    },
    header: {
        marginTop: 10,
        marginBottom: 8,
        color: '#80858a'
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
        color: "white",
        border: "none",
        height: "calc(1.5em + .75rem + 2px)",
        '&:hover': {
            color: 'white',
            backgroundColor: "#3358C4",
        }
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
    const [patients, setPatients] = useState([]);
    const patientData = PatientExerciseData;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {

            // Newly added to load Firestore data
            var p = [];
            db.collection("patients").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    p.push(doc.data());
                });
                setPatients(p);
            });

        };
        
        fetchPatients();
    }, []);

    useEffect(() => {
        if (patients.length != 0) {
            setLoaded(true);
        }
    }, [patients]);


    const renderItems = () => {
        return (
            <div>
                <AppBar position="static" className={classes.appBar}>
                    <img className={classes.tendonLogo} src="/img/tendonlogo.png"></img>
                </AppBar>
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

                        {patients.map((p, i) => {
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
    };

    const renderTable = () => {
        return <div className={classes.window}>{renderItems()}</div>;
    };

    const renderLoading = () => {
        return <h1>Loading...</h1>;
    };

    return (
        <div className={classes.window}>
            {loaded ? renderTable() : renderLoading()}
        </div>
    );
};

export default DoctorView;




