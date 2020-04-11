import React, { useState, useEffect, useContext } from "react";
import Patient from "./Patient";
import PatientExerciseData from "../ModelJSON/PatientExercises.json";
import Container from "@material-ui/core/Container";
import { render } from "@testing-library/react";
import { makeStyles } from "@material-ui/core/styles";
// import { Button } from '@material-ui/core';
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import YouTube from "react-youtube";
import { withStyles } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ExerciseTracking from "./PatientExerciseTracking";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { db } from "../Firebase.js";

import { UserContext } from "../contexts/UserContext";

const useStyles = makeStyles((theme) => ({
  exercises: {
    height: "55%",
  },
  header: {
    marginTop: 10,
    marginBottom: 8,
    color: "#80858a",
  },
  meter: {
    marginTop: 25,
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
    width: "80%",
    margin: "0 auto",
  },
  link: {
    textDecoration: "none",
    textAlign: "right",
    "&:hover": {
      color: "white",
    },
  },
  startButton: {
    padding: "0.375rem 0.9rem !important",
    marginTop: 20,
  },
  stretchGraphic1: {
    height: 240,
    marginLeft: "8%",
    marginTop: 30,
  },
  stretchGraphic2: {
    height: 170,
    marginLeft: "4%",
    marginTop: 30,
    marginBottom: "5%",
  },
  footer: {
    // position: 'fixed',
    // bottom: 0,
    // right: 0,
    display: "flex",
    flexDirection: "row",
    marginTop: "7%",
    width: "100%",
    height: 300,
    backgroundColor: "#e8ebed",
  },
  circle: {
    marginTop: 25,
    backgroundColor: "white",
    borderRadius: "300px 0px 0px 0px",
    height: 225,
    width: "30%",
    float: "right",
  },
  window: {
    height: "100%",
  },
  quote: {
    marginTop: "5%",
    color: "#80858a",
    marginLeft: "20%",
    fontWeight: "530",
    fontSize: 25,
  },
}));

const calculateTotalTime = (s) => {
  var t = 0;
  for (const [i, entry] of Object.entries(s.exercise)) {
    t += entry.duration;
  }
  return t;
};

const formatExerciseName = (n) => {
  var splitStr = n.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
};

const findPatient = (userId, patients) => {
  for (var i = 0; i < patients.length; i++) {
    if (patients[i].uid == userId) {
      return patients[i];
    }
  }
};

const PatientExerciseMain = (props) => {
  const [exerciseSets, setExerciseSets] = useState([]);
  const [percentFinished, setPercentFinished] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const currUser = useContext(UserContext).user;

  //user id used to load correct user exercises (taken from landing page)
  console.log(currUser);
  console.log(props.location.state.userId);
  const [user, setUser] = useState("");
  const classes = useStyles();

  // note: need to load data asynchronously first
  useEffect(() => {
    const fetchPatients = async () => {
      //load firestore data
      var p = [];
      db.collection("patients")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var d = doc.data();
            d.uid = doc.id;
            p.push(d);
          });

          setExerciseSets(p);
        });
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (props.location.state.userId) {
      setUser(props.location.state.userId);
      localStorage.setItem("currUser", props.location.state.userId);
    }
    //handles when user hits back button on PatientExerciseTracking
    else {
      var retrievedUser = localStorage.getItem("currUser");
      setUser(retrievedUser);
    }

    //stores userId in local storage to be retrieved for case above ^^
  }, []);

  useEffect(() => {
    if (exerciseSets.length != 0) {
      setLoaded(true);
    }
  }, [exerciseSets]);

  const renderItems = () => {
    const person = findPatient(user, exerciseSets);

    return (
      <div className={classes.window}>
        <div className={classes.exercises}>
          {person.sets.map((s, i) => {
            return (
              <div className={classes.exerciseContainer} key={i}>
                <Typography variant="h4" className={classes.header}>
                  {s.day} Exercises ({calculateTotalTime(s)} minutes)
                </Typography>
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
                  );
                })}
                <Link
                  to={{
                    pathname: "/workout/dotw",
                    exerciseProps: s,
                    setInd: i,
                  }}
                >
                  <Button variant="light" className={classes.startButton}>
                    Start
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
        <footer className={classes.footer}>
          <img
            src={"/img/StretchGraphic2.png"}
            className={classes.stretchGraphic2}
          />
          <img
            src={"/img/StretchGraphic1.png"}
            className={classes.stretchGraphic1}
          />
          <Typography className={classes.quote}>
            "Movement is a medicine for creating change <br />
            in a person's physical, emotional, and mental states."
            <Typography variant="h6">
              <br />- Carol Welch
            </Typography>
          </Typography>
        </footer>
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

export default PatientExerciseMain;
