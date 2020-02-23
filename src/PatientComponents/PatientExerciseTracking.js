import React, {useState, useEffect} from 'react';
import Patient from '../PatientComponents/Patient'
import PatientExercises from '../ModelJSON/PatientExercises.json';
import Container from '@material-ui/core/Container';
import { render } from '@testing-library/react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import YouTube from 'react-youtube';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';

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
        // marginLeft: 120,
        height: 250,
        width: 460,
        // display: 'block',
        // margin: 'auto'
    },
    checklistContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    appBar: {
        backgroundColor: '#bfd9ff',
        boxShadow: 'none'
    },
    exerciseContainer: {
        width: 600,
        marginTop: 30,
        textAlign: 'center'
    },
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
        <Carousel activeIndex={index} direction={direction} onSelect={handleSelect}>
            {/* {PatientExercises.map( exercise =>  */}
            <Carousel.Item>
                <YouTube
                    videoId="bv373Y1oeck"
                    className={classes.video}
                />
                <Carousel.Caption>
                <Typography variant="h6">Calf Stretch</Typography>
                </Carousel.Caption>
            </Carousel.Item>
            {/* )} */}
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
                <Typography variant="h4" className={classes.header}>Weekly Exercises</Typography>
                <Divider />
                <ExerciseCarousel />
            </Container>
        </div>
    );
}

export default ExerciseTracking;