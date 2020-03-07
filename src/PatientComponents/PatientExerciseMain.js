import React, {useState, useEffect} from 'react';
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
        padding: '0.375rem 0.9rem !important',
        marginTop: 20
    }, 
    stretchGraphic: {
        height: 225,
        marginLeft: 15,
        marginTop: 55
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
        fetchPatients().then((data)=>{
            setExerciseSets(Object.values(data))
        })
    }, []);

    useEffect(()=>{
        if(exerciseSets.length != 0) {
            setLoaded(true)
        }
    }, [exerciseSets])



    const renderItems = () => {
        const person = exerciseSets[0];

        return(
            <div>
                    <div>
                        {person.sets.map((s,i) => {
                            return(
                                <div>
                                <Container className={classes.exerciseContainer} key={i}>
                                <Typography variant="h4" className={classes.header}>{s.day} Exercises ({calculateTotalTime(s)} minutes)</Typography>
                                <Row>
                                    <Col>Exercise</Col>
                                    <Col>Reps</Col>
                                    <Col>Duration</Col>
                                </Row>
                                <Divider />
                                {Object.values(s.exercise).map((ex,k) => {
                                    return(
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
                                    <Button className={classes.startButton}>Start</Button>
                                </Link>
                                </Container>
                            </div>)
                        })}
                    </div>
                    {/* })} */}
            </div>
        )
    }

    const renderTable = () => {
        return(
            <div>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6">PRM: Anni Rogers</Typography>
                    </Toolbar>
                </AppBar>

                {renderItems()}
                <img src={"/img/StretchGraphic.png"} className={classes.stretchGraphic}/>
        </div>
        )
    }

    const renderLoading = () => {
        return(<h1>Loading...</h1>)
    }
    
    return(
        <div>
             {loaded ? renderTable() : renderLoading()}
        </div>
    );
}

export default PatientExerciseMain


