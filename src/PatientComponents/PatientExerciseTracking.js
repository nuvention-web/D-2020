import React, {useState, useEffect} from 'react';
import Patient from '../PatientComponents/Patient'
import PatientExercises from '../ModelJSON/PatientExercises.json';
import Container from '@material-ui/core/Container';
import { render } from '@testing-library/react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import YouTube from 'react-youtube';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import nextIcon from '../img/nextarrow.svg';
import prevIcon from '../img/prevarrow.svg';
import Timer from 'react-compound-timer';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import PatientExerciseMain from './PatientExerciseMain';
import '../PatientExerciseTracking.css';

const useStyles = makeStyles(theme => ({
    exercises: {
        marginTop: 15,
        minWidth: 250
    },
    header: {
        display: 'inline-block',
        marginTop: 10,
        marginBottom: 8,
        color: '#80858a'
    },
    video: {
        flexGrow: 1,
        minHeight: 375,
        height: '100%',
        width: '70%',
    },
    appBar: {
        backgroundColor: '#bfd9ff',
        boxShadow: 'none'
    },
    exerciseContainer: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 950,
        marginTop: 30,
        textAlign: 'center'
    },
    carousel: {
        display: 'flex',
        minWidth: 900,
        marginTop: 45,
        marginBottom: 50
    },
    nextArrow: {
        display: 'inline-block',
        width: 40,
        height: 40,
        marginBottom: '70%',
        background: 'no-repeat 50%/100% 100%',
        backgroundImage: `url(${nextIcon})`
    },
    prevArrow: {
        display: 'inline-block',
        width: 40,
        height: 40,
        marginBottom: '70%',
        background: 'no-repeat 50%/100% 100%',
        backgroundImage: `url(${prevIcon})`
    },
    backButton: {
        float: 'left',
        padding: '0.375rem 0.75rem !important'
    },
    timer: {
        position: 'absolute',
        textAlign: 'center',
        right: '15%',
        left: '15%',
        bottom: -95
    },
    timerButtons: {
        marginRight: 5,
        fontSize: 12,
        height: 29,
        paddingBottom: 7
    }
}));


const ExerciseCarousel = () => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(null);
    const classes = useStyles();
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
        setDirection(e.direction);
    };
    return(
        <Carousel activeIndex={index} 
                  direction={direction} 
                  onSelect={handleSelect} 
                  nextIcon={<span aria-hidden="true" className={classes.nextArrow} />}
                  prevIcon={<span aria-hidden="true" className={classes.prevArrow} />}
                  className={classes.carousel}
                  interval={0}>
            {PatientExercises.sets[0].exercise.map( exercise => 
            <Carousel.Item key={exercise.id}>
                <YouTube
                    videoId={exercise.videoId}
                    className={classes.video}
                />
                <Carousel.Caption>
                <Typography variant="h6">{exercise.name}</Typography>
                </Carousel.Caption>
                <div className={classes.timer}>
                <Timer
                    initialTime={exercise.duration * 60000 }
                    direction="backward"
                    startImmediately={false}
                >
                    {({ start, stop, reset }) => (
                        <React.Fragment>
                            <Timer.Minutes />:
                            <Timer.Seconds formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}/>
                            <br />
                            <Button onClick={start} className={classes.timerButtons}>Start</Button>
                            <Button onClick={stop} className={classes.timerButtons}>Stop</Button>
                            <Button onClick={reset} className={classes.timerButtons}>Reset</Button>
                        </React.Fragment>
                    )}
                </Timer>
                </div>
            </Carousel.Item>
            )}
        </Carousel>
    );
}
const ExerciseTracking = () => {
    const classes = useStyles();
    return(
        <div>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6">PRM</Typography>
                </Toolbar>
            </AppBar>
         
            <Container className={classes.exerciseContainer}>
                <Typography variant="h4" className={classes.header}>
                    <Link to="/workout" className={classes.link}>
                        <Button className={classes.backButton} variant="outline-primary">Back</Button>
                    </Link>
                    Weekly Exercise
                </Typography>
                <Divider />
                <ExerciseCarousel />
            </Container>
        </div>
    );
}

export default ExerciseTracking;