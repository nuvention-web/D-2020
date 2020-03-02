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
    const [loaded, setLoaded] = useState(false)
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
        console.log(exerciseSets)
        return(
            <div>
                <h1>render</h1>
                {exerciseSets.map((person, i) => {
                    console.log("person:", person)
                    console.log('------')
                    return(<div>
                        <h1>{person.name}</h1>
                        {person.sets.map((e,i) => {
                            return(<div>
                                <h1>{e.day}</h1>
                                {e.exercise.map((n,k) => {
                                    return(
                                    <div>
                                        <h1>{n.name}</h1>
                                        <h1>{n.reps}</h1>
                                    </div>
                                    )
                                })}
                            </div>)
                        })}
                    </div>)
                })}
            </div>
        )
    }
            // {   exerciseSets[0].sets.map( (set, i) => {
            //     return(
            //     <Container className={classes.exerciseContainer} key={i}>
            //     <Typography variant="h4" className={classes.header}>{set.day} Exercises ({calculateTotalTime(set)} minutes)
            //         <Link to= {{
            //             pathname: "/workout/dotw",
            //             patientProps: {currentSet: set}
            //         }}
            //             className={classes.link}
            //         >
            //             <Button className={classes.startButton} variant="outline-primary">Start</Button>
            //         </Link>
            //     </Typography>
            //     <div className={classes.checklistContainer}>
            //     <Row>
            //         <Col>Exercise</Col>
            //         <Col>Reps</Col>
            //         <Col>Duration</Col>
            //     </Row>
            //     <Divider />
            //         {set.exercise.map( (exercise, i) => {
            //             return(
            //                 <Row key={i}>
            //                     <Col>{formatExerciseName(exercise.name)}</Col>
            //                     <Col>{exercise.reps}</Col>
            //                     <Col>{exercise.duration}</Col>
            //                 </Row>
            //             )
            //         }
            //         )}
            //     </div>
            //     </Container>
            //         )
            //     }
            //     )}
            // }

    const renderTable = () => {
        console.log(exerciseSets)
        return(
            <div>
                {/* <h1>{Object.keys(exerciseSets)[0]}</h1> */}
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6">PRM</Typography>
                    </Toolbar>
                </AppBar>
<<<<<<< HEAD

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
=======
                {   exerciseSets[0].sets.map( (set, i) => {
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
                <img src={"/img/StretchGraphic.png"} className={classes.stretchGraphic}/>
            </div>
        );
    }
    else {
        return <Typography>Loading Data</Typography>;
    }
>>>>>>> 469d723fc4ecd43cca7c205a26323b2faa43dba5
}

export default PatientExerciseMain


