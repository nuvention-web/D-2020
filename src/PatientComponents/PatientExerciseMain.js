import React, { useState, useEffect } from 'react';
import Patient from '../PatientComponents/Patient'
import PatientExerciseData from '../ModelJSON/PatientExercises.json';
import Container from '@material-ui/core/Container';
import { render } from '@testing-library/react';
import { makeStyles } from '@material-ui/core/styles';
// import { Button } from '@material-ui/core';
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
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import db from '../Firebase.js';


const useStyles = makeStyles(theme => ({
    exercises: {
        height: '55%'
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
        marginTop: 30,
        marginBottom: 40,
        width: '80%',
        margin: '0 auto'
    },
    link: {
        textDecoration: 'none',
        textAlign: 'right',
        '&:hover': {
            color: 'white'
        },
    },
    startButton: {
        padding: '0.375rem 0.9rem !important',
        marginTop: 20
    },
    stretchGraphic1: {
        height: 240,
        marginLeft: '8%',
        marginTop: 30
    },
    stretchGraphic2: {
        height: 170,
        marginLeft: '4%',
        marginTop: 30,
        marginBottom: '5%'
    },
    footer: {
        // position: 'fixed',
        // bottom: 0,
        // right: 0,
        display: 'flex',
        flexDirection: 'row',
        marginTop: '7%',
        width: '100%',
        height: 300,
        backgroundColor: '#e8ebed',
    },
    circle: {
        marginTop: 25,
        backgroundColor: 'white',
        borderRadius: '300px 0px 0px 0px',
        height: 225,
        width: '30%',
        float: 'right'
    },
    window: {
        height: '100%'
    },
    quote: {
        marginTop: '5%',
        color: '#80858a',
        marginLeft: '20%',
        fontWeight: '530',
        fontSize: 25
    }
}));

const calculateTotalTime = (s) => {
    var t = 0
    for (const [i, entry] of Object.entries(s.exercise)) {
        t += entry.duration;
    }
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
    const [exerciseSets, setExerciseSets] = useState([])
    const [percentFinished, setPercentFinished] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const classes = useStyles();

    // note: need to load data asynchronously first
    useEffect(() => {
        const fetchPatients = async () => {
            const snapshot = await db.once('value');
            const value = snapshot.val();
            return value
        }
        fetchPatients().then((data) => {
            setExerciseSets(Object.values(data))
        })
    }, []);

    useEffect(() => {
        if (exerciseSets.length != 0) {
            setLoaded(true)
        }
    }, [exerciseSets])



    const renderItems = () => {
        const person = exerciseSets[0];

        return (
                <div className={classes.window}>
                <div className={classes.exercises}>
                    {person.sets.map((s, i) => {
                        return (
                                <div className={classes.exerciseContainer} key={i}>
                                    <Typography variant="h4" className={classes.header}>{s.day} Exercises ({calculateTotalTime(s)} minutes)</Typography>
                                    <Row>
                                        <Col>Exercise</Col>
                                        <Col>Reps</Col>
                                        <Col>Duration</Col>
                                    </Row>
                                    <Divider />
                                    {Object.values(s.exercise).map((ex, k) => {
                                        return (
                                            <div>
                                                <Row key={i}>
                                                    <Col>{formatExerciseName(ex.name)}</Col>
                                                    <Col>{ex.reps}</Col>
                                                    <Col>{ex.duration}</Col>
                                                </Row>
                                            </div>
                                        )
                                    })}
                                    <Link to={{
                                        pathname: "/workout/dotw",
                                        exerciseProps: s,
                                        setInd: i
                                    }}>
                                        <Button variant="light" className={classes.startButton}>Start</Button>
                                    </Link>
                                </div>)
                    })}
                    </div>
                    <footer className={classes.footer}>
                        <img src={"/img/StretchGraphic2.png"} className={classes.stretchGraphic2} />
                        <img src={"/img/StretchGraphic1.png"} className={classes.stretchGraphic1} />
                        <Typography className={classes.quote}>
                            "Movement is a medicine for creating change <br />
                            in a person's physical, emotional, and mental states."
                            <Typography variant="h6">
                            <br />
                            - Carol Welch
                            </Typography>
                        </Typography>
                    </footer>
                </div>
        )
    }

    const renderTable = () => {
        return (
            <div className={classes.window}>
                {renderItems()}
            </div>
        )
    }

    const renderLoading = () => {
        return (<h1>Loading...</h1>)
    }

    return (
        <div className={classes.window}>
            {loaded ? renderTable() : renderLoading()}
        </div>
    );
}

export default PatientExerciseMain


