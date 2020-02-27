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
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import IndividualPatientView from './IndividualPatientView';
import { Button } from '@material-ui/core';


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
    }    

}));


const DoctorView = () => {
    const classes = useStyles();
    const [patients, setPatient] = useState(PatientData.patients)

const renderPatients = () => {
    render(
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            >
        {
            patients.map((p, i) => {
                return(
                    <div>
                    

                        <Grid item xs={6}>
                            <Patient 
                            name={p.name} 
                            photo={p.photo}
                            profile={p.profile}
                            />
                        </Grid>
                    </div>

                )
        })
        }
        </Grid>
    )
}
    return ( 
        <div>
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6">PRM</Typography>
            </Toolbar>
        </AppBar>

        <Container fixed>
            <Typography variant="h4" className={classes.header}>Patient Dashboard</Typography>
            
            <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            >
        {
            patients.map((p, i) => {
                return(
                <Link to= {{
                    pathname: "/PT/patient",
                    patientProps: {patientInfo: p}
                }}
                    className={classes.link}
                >
       
                
                    <div>
                    

                        <Grid item xs={6}>
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




