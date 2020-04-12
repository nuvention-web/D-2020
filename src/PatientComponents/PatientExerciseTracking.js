import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@material-ui/core";
import YouTube from "react-youtube";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faArrowLeft,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import Timer from "react-compound-timer";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import Sidebar from "react-sidebar";

const useStyles = makeStyles((theme) => ({
  exercises: {
    marginTop: 15,
    minWidth: 250,
  },
  header: {
    display: "inline-block",
    marginTop: 10,
    marginBottom: 8,
    color: "#80858a",
  },
  video: {
    flexGrow: 1,
    minHeight: 500,
    width: "70%",
  },
  appBar: {
    backgroundColor: "#bfd9ff",
    boxShadow: "none",
  },
  exerciseContainer: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    height: "100%",
    marginTop: "30px",
  },
  carousel: {
    display: "flex",
    marginTop: 45,
    height: "100%",
    width: "100%",
  },
  arrows: {
    display: "inline-block",
    marginBottom: "70%",
    fontSize: 70,
    background: "no-repeat 50%/100% 100%",
  },
  backButton: {
    float: "left",
    marginLeft: 27,
    fontSize: 30,
    width: 70,
    height: 54,
  },
  timer: {
    position: "absolute",
    textAlign: "center",
    right: "15%",
    left: "15%",
    bottom: -125,
  },
  time: {
    fontSize: 20,
  },
  tasksBtn: {
    fontSize: 27,
    float: "right",
    marginRight: 20,
    width: 70,
  },
  tasks: {
    width: 350,
    color: "#74797d",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "100%",
    height: 100,
    backgroundColor: "#e1e7ed",
  },
  footerText: {
    marginTop: "11%",
    marginLeft: 15,
    fontSize: 18,
  },
  checklstHeader: {
    marginTop: "9%",
    marginLeft: 15,
    marginBottom: 10,
  },
}));

const ExerciseCarousel = ({ set }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const classes = useStyles();
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    setDirection(e.direction);
  };

  return (
    <Carousel
      activeIndex={index}
      direction={direction}
      onSelect={handleSelect}
      nextIcon={
        <FontAwesomeIcon
          icon={faChevronRight}
          color="#8d9399"
          className={classes.arrows}
        />
      }
      prevIcon={
        <FontAwesomeIcon
          icon={faChevronLeft}
          color="#8d9399"
          className={classes.arrows}
        />
      }
      className={classes.carousel}
      interval={0}
      indicators={false}
    >
      {Object.values(set.exercise).map((exercise) => (
        <Carousel.Item key={exercise.id}>
          <YouTube videoId={exercise.videoId} className={classes.video} />
          <Carousel.Caption>
            <Typography variant="h5">{exercise.name}</Typography>
          </Carousel.Caption>
          <div className={classes.timer}>
            <Timer
              initialTime={exercise.duration * 60000}
              direction="backward"
              startImmediately={false}
            >
              {({ start, stop, reset }) => (
                <React.Fragment>
                  <div className={classes.time}>
                    <Timer.Minutes />:
                    <Timer.Seconds
                      formatValue={(value) =>
                        `${value < 10 ? `0${value}` : value}`
                      }
                    />
                  </div>
                  <Button onClick={start} className="timer-btn">
                    Start
                  </Button>
                  <Button onClick={stop} className="timer-btn">
                    Stop
                  </Button>
                  <Button onClick={reset} className="timer-btn">
                    Reset
                  </Button>
                </React.Fragment>
              )}
            </Timer>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

const ExerciseTracking = (props) => {
  const [currentSet, setCurrentSet] = useState(props.location.exerciseProps);
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [checked, setChecked] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    //if page is refreshed, can retrieve and parse into JSON
    if (typeof props.location.exerciseProps === "undefined") {
      var retrievedSet = JSON.parse(localStorage.getItem("currSet"));
      setCurrentSet(retrievedSet);
      setChecked(Array(Object.values(retrievedSet.exercise).length).fill(0));
    }

    //store object for refresh as string
    else {
      localStorage.setItem(
        "currSet",
        JSON.stringify(props.location.exerciseProps)
      );
      setChecked(
        Array(Object.values(props.location.exerciseProps.exercise).length).fill(
          0
        )
      );
    }
  }, []);

  useEffect(() => {
    if (typeof currentSet !== "undefined") {
      setLoaded(true);
    }
  }, [currentSet]);

  const SideBar = () => {
    const handleChecked = (i) => {
      var updatedCheck = [...checked];
      updatedCheck[i] = !updatedCheck[i];
      setChecked(updatedCheck);
      setProgress(
        100 * (updatedCheck.reduce((a, b) => a + b, 0) / checked.length)
      );
    };

    return (
      <div className={classes.tasks}>
        <div>
          <Typography variant="h5" className={classes.checklstHeader}>
            Completed Exercises
          </Typography>
        </div>
        <List>
          {Object.values(currentSet.exercise).map((exercise, i) => (
            <ListItem key={exercise.id}>
              <ListItemText primary={`${i + 1}. ${exercise.name}`} className />
              <Checkbox
                checked={checked[i]}
                color="default"
                onChange={() => handleChecked(i)}
              />
            </ListItem>
          ))}
        </List>
        <div className={classes.footer}>
          <Typography className={classes.footerText}>
            Percent completed: {progress.toFixed(2)}%
          </Typography>
        </div>
      </div>
    );
  };

  const renderExerciseTracking = () => {
    return (
      <Sidebar
        open={sidebar}
        sidebar={<SideBar />}
        pullRight={true}
        onSetOpen={() => setSidebar(false)}
        styles={{ sidebar: { background: "white" } }}
      >
        <div className={classes.exerciseContainer}>
          <Typography variant="h4" className={classes.header}>
            <Link to="/workout" className={classes.link}>
              <Button variant="light" className={classes.backButton}>
                <FontAwesomeIcon icon={faArrowLeft} color="#9DB4FF" />
              </Button>
            </Link>
            {currentSet.day}'s Exercises
            <Button
              variant="light"
              onClick={() => setSidebar(true)}
              className={classes.tasksBtn}
            >
              <FontAwesomeIcon icon={faTasks} color="#9DB4FF" />
            </Button>
          </Typography>
          <Divider />
          <ExerciseCarousel set={currentSet} />
        </div>
      </Sidebar>
    );
  };

  const renderLoading = () => {
    return <h1>Loading...</h1>;
  };

  return <div>{loaded ? renderExerciseTracking() : renderLoading()}</div>;
};

export default ExerciseTracking;
