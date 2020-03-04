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
        float: 'right'
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


// const addSets = patients => ({
//     sets: Object.values(patients["Anni Rogers"].sets)
// })

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
            console.log(value)
            return value
        }
        fetchPatients().then((data)=>{
            console.log(data)
            setExerciseSets(Object.values(data))
        })
        // setExerciseSets(fetchPatients());
    }, []);

    useEffect(()=>{
        console.log(exerciseSets)
        if(exerciseSets.length != 0) {
            setLoaded(true)
        }
    }, [exerciseSets])


    // useEffect(() => {
    //     const handleData = snap => {
    //       if (snap.val()) setExerciseSets(Object.values(snap.val()));
    //     }
    //     db.on('value', handleData, error => alert(error));
    //     return () => { db.off('value', handleData); };
    //   }, []);
    
    
    // const StyledButton = withStyles({
    //     root: {
    //       background: 'linear-gradient(45deg, #2980B9 50%, #6DD5FA 100%)',
    //       borderRadius: 3,
    //       border: 0,
    //       color: 'white',
    //       height: 48,
    //       padding: '0 30px',
    //       boxShadow: '0 3px 5px 2px #fff',
    //     },
    //     label: {
    //       textTransform: 'capitalize',
    //     },
    //   })(Button);


    const renderItems = () => {
        console.log("exerciseSets:", exerciseSets[0])
        const person = exerciseSets[0];

        return(
            <div>
                {/* {exerciseSets.map((person, i) => {
                    console.log("person:", person)
                    console.log('------')
                    return( */}
                    <div>
                        {/* <h1>{person.name}</h1> */}
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
                                </Container>
                            </div>)
                        })}
                    </div>
                    {/* })} */}
            </div>
        )
    }

    const renderTable = () => {
        console.log(exerciseSets)
        return(
            <div>
                {/* <h1>{Object.keys(exerciseSets)[0]}</h1> */}
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


