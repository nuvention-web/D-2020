import React, { useState, useEffect } from "react";
import Patient from "../PatientComponents/Patient";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PatientData from "../ModelJSON/Patients.json";
import { render } from "@testing-library/react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PresetExercisesData from "../ModelJSON/PresetExercises.json";
// import PatientExerciseData from '../ModelJSON/PatientExercises.json';
import { db } from "../Firebase.js";

const useStyles = makeStyles((theme) => ({
  exercises: {
    marginTop: 15,
    minWidth: 250,
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
  appBar: {
    backgroundColor: "#bfd9ff",
    boxShadow: "none",
  },
  exerciseContainer: {
    marginTop: 30,
  },
  link: {
    textDecoration: "none",
    textAlign: "right",
    "&:hover": {
      color: "white",
    },
  },
  stretchGraphic: {
    height: 225,
    marginLeft: 15,
    marginTop: 55,
  },
  exerciseBox: {
    width: 200,
  },
  blueButton: {
    backgroundColor: "#9DB4FF",
    border: "none",
    height: "calc(1.5em + .75rem + 2px)",
  },
  accentDivider: {
    content: "",
    display: "block",
    width: "6.25rem",
    height: ".325rem",
    marginTop: "1.5rem",
    background: "#9DB4FF",
  },
  arrowIcon: {
    maxWidth: 20,
  },
  inputBox: {
    width: 50,
    height: "calc(1.5em + .75rem + 2px)",
    borderRadius: 5,
    border: "1px solid #ccc",
  },
}));

const IndividualPatientView = (props) => {
  // patientData stores the specific patient we are looking at
  const [patientData, setPatientData] = useState("");
  const classes = useStyles();
  const [newExercise, setNewExercise] = useState("Calf Wall Stretch");
  const [newReps, setNewReps] = useState(1);
  const [newDuration, setNewDuration] = useState(5);

  const [patientIndex, setPatientIndex] = useState("");

  // For loading data, taken from PatientExerciseMain
  // exerciseSets actually contains our entire json (all patients)
  const [exerciseSets, setExerciseSets] = useState([]);
  const [loaded, setLoaded] = useState(false); // Unsure if we need this one

  // Loading data, taken from PatientExerciseMain
  useEffect(() => {
    const fetchPatients = async () => {
      const snapshot = await db.once("value");
      const value = snapshot.val();
      console.log(value);
      return value;
    };
    fetchPatients().then((data) => {
      console.log(data);
      setExerciseSets(Object.values(data));
    });
  }, []);

  useEffect(() => {
    console.log(exerciseSets);
    if (exerciseSets.length != 0) {
      setLoaded(true);
    }
  }, [exerciseSets]);
  // End loading data

  // Keeping track of which patient we are looking at
  useEffect(() => {
    // If prop is undefined, retrieve id local storage, then access via Firebase
    if (typeof props.location.patientProps === "undefined") {
      var cpi = localStorage.getItem("currPatient");

      // Set patient data from Firebase
      console.log("patient index fr local storage", patientIndex);
      setPatientData(exerciseSets[patientIndex]);
      console.log(
        "patient data retrieved from local storage",
        exerciseSets[patientIndex]
      );
    }
    // Use prop if available. Also store in local storage for future use
    else {
      // setPatientData(props.location.patientProps.patientInfo);
      localStorage.setItem("currPatient", patientData.id);
      console.log("props", props.location.patientProps.patientInfo.id);
      const pi = props.location.patientProps.patientInfo.id;
      setPatientIndex(pi);
    }
  }, []);

  // const findExercise = (exercise) => {
  //     const exercises = Object.values(PresetExercisesData);
  //     for (var i = 0; i < exercises.length; i++) {
  //         if (exercises[i].name === exercise) {
  //             return exercises[i];
  //         }
  //     }
  // }

  // Submit new exercise to firebase
  const addExercise = (setIndex) => {
    console.log("Adding this exercise to firebase! :)", newExercise);
    var exerciseObjectData = {
      id: 0,
      name: newExercise,
      reps: newReps,
      duration: newDuration,
      videoId: "MW2WG5l-fYE",
    };
    // var exerciseObjectData = findExercise(newExercise);
    var exerciseListRef = db
      .child("Vanessa Jones/sets/" + setIndex.toString() + "/exercise")
      .push(exerciseObjectData);
  };

  // Repeat function from PatientExerciseMain
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

  const renderItems = () => {
    // For now, our patient is default to Anni Rogers
    const person = exerciseSets[2];

    return (
      <div>
        <div>
          <Container>
            <Typography variant="h4" className={classes.header}>
              {person.name}
            </Typography>
            <div className={classes.accentDivider}></div>
          </Container>
          {person.sets.map((s, i) => {
            return (
              <div>
                <Container className={classes.exerciseContainer} key={i}>
                  <Typography variant="h4" className={classes.header}>
                    {s.day} Exercises ({calculateTotalTime(s)} minutes)
                  </Typography>
                  <Row>
                    <Col>Exercise</Col>
                    <Col>Reps</Col>
                    <Col>Duration</Col>
                    <Col></Col>
                  </Row>
                  <Divider />
                  {Object.values(s.exercise).map((ex, k) => {
                    return (
                      <div>
                        <Row key={k}>
                          <Col>{formatExerciseName(ex.name)}</Col>
                          <Col>{ex.reps}</Col>
                          <Col>{ex.duration}</Col>
                          <Col></Col>
                        </Row>
                      </div>
                    );
                  })}
                  <Form>
                    <br />
                    <Row>
                      <Col>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Control
                            as="select"
                            className={classes.exerciseBox}
                            onChange={(event) => {
                              setNewExercise(event.target.value);
                            }}
                          >
                            {PresetExercisesData.map((exercise, i) => {
                              return (
                                <option value={exercise.name}>
                                  {exercise.name}
                                </option>
                              );
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col>
                        <input
                          type="text"
                          className={classes.inputBox}
                          onChange={(event) => {
                            setNewReps(event.target.value);
                          }}
                        />
                      </Col>
                      <Col>
                        <input
                          type="text"
                          className={classes.inputBox}
                          onChange={(event) => {
                            setNewDuration(event.target.value);
                          }}
                        />
                      </Col>
                      <Col>
                        <Button
                          variant="primary"
                          className={classes.inputBox}
                          type="submit"
                          className={classes.blueButton}
                          onClick={() => {
                            addExercise(i);
                          }}
                        >
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Container>
              </div>
            );
          })}
        </div>
        {/* })} */}
      </div>
    );
  };

  const renderTable = () => {
    return (
      <div>
        <Container>
          <Link to="/PT" className={classes.link}>
            <Button className={classes.blueButton} variant="outline-primary">
              {/* <img className={classes.arrowIcon} src="/img/arrowleft.png"></img> */}
              Back
            </Button>
          </Link>
          {console.log("exercise sets", exerciseSets)}
        </Container>

        {renderItems()}
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <h1>
        <CircularProgress />
      </h1>
    );
  };

  return <div>{loaded ? renderTable() : renderLoading()}</div>;
};

export default IndividualPatientView;
