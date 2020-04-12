import React, { useState, useEffect } from "react";
import {
  Container,
  AppBar,
  Typography,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PresetExercisesData from "../ModelJSON/PresetExercises.json";
import { db } from "../Firebase.js";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    height: 100,
    display: "inline-block",
  },
  tendonLogo: {
    width: 150,
    float: "left",
    display: "inline-block",
    margin: "40px 30px",
  },
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
    color: "white",
    border: "none",
    height: "calc(1.5em + .75rem + 2px)",
    "&:hover": {
      color: "white",
      backgroundColor: "#3358C4",
    },
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
  const classes = useStyles();
  // patientData stores the specific patient we are looking at
  const [patientData, setPatientData] = useState([]);
  const [newExercise, setNewExercise] = useState("Calf Wall Stretch");
  const [newReps, setNewReps] = useState(1);
  const [newDuration, setNewDuration] = useState(5);

  const [patientIndex, setPatientIndex] = useState("");

  // For loading data, taken from PatientExerciseMain
  // exerciseSets actually contains our entire json (all patients)
  const [exerciseSets] = useState([]); //delete later
  const [loaded, setLoaded] = useState(false);
  const [foundDID, setfoundDID] = useState(false);

  // Retrieve the docID from either prop or local storage if prop is unavailable (refresh)
  useEffect(() => {
    // If prop is undefined, retrieve id local storage, then access via Firebase
    if (typeof props.location.patientProps === "undefined") {
      var pi = localStorage.getItem("currPatient");
      setPatientIndex(pi);
    }
    // Use prop if available. Also store in local storage for future use
    else {
      localStorage.setItem(
        "currPatient",
        props.location.patientProps.patientInfo.docId
      );
      console.log("props", props.location.patientProps.patientInfo);
      const pi = props.location.patientProps.patientInfo.docId;
      setPatientIndex(pi);
    }
  }, []);

  // To check that we have retrieved the docID (from storage or prop) so that Firestore retrieval works
  useEffect(() => {
    console.log("patientIndex", patientIndex);
    if (patientIndex !== "") {
      setfoundDID(true);
    }
  }, [patientIndex]);

  // Use docID to retreive a specific patient's data from Firestore
  useEffect(() => {
    const fetchPatient = async () => {
      console.log("fet patient", foundDID);
      if (foundDID) {
        // Newly added to load Firestore data
        var patientRef = db.collection("patients").doc(patientIndex);
        console.log(patientRef);

        patientRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              setPatientData(doc.data());
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function (error) {
            console.log("Error getting document:", error);
          });
      }
    };
    fetchPatient();
  }, [foundDID]);
  // last line refers to how this useEffect will rerun if value of foundDID changes

  useEffect(() => {
    console.log("patientData", patientData);
    if (patientData.length !== 0) {
      setLoaded(true);
    }
  }, [patientData]);
  // End loading data

  // const findExercise = (exercise) => {
  //     const exercises = Object.values(PresetExercisesData);
  //     for (var i = 0; i < exercises.length; i++) {
  //         if (exercises[i].name === exercise) {
  //             return exercises[i];
  //         }
  //     }
  // }

  const getUpdatedSet = (setIndex) => {
    // Generate new exercise
    var exerciseObjectData = {
      id: 0,
      name: newExercise,
      reps: parseInt(newReps),
      duration: parseInt(newDuration),
      videoId: "MW2WG5l-fYE",
    };
    // var exerciseObjectData = findExercise(newExercise);
    console.log("Adding this exercise to firebase! :)", newExercise);

    let currSet = patientData.sets;
    currSet = [...currSet[setIndex].exercise, exerciseObjectData];
    currSet[setIndex].exercise.push(exerciseObjectData);
    console.log("new currSet:", currSet);
    return currSet;
  };

  // Submit new exercise to firebase
  const addExercise = async (e, setIndex) => {
    // For debugging purposes - pauses refresh on submit
    // e.preventDefault();

    const currSet = await getUpdatedSet(setIndex);
    console.log("currSet:", currSet);

    // Firestore reference
    var patientRef = db.collection("patients").doc(patientIndex);

    return patientRef
      .update({
        sets: currSet,
      })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });

    // Old RTD update
    // var exerciseListRef = db
    //   .child("Vanessa Jones/sets/" + setIndex.toString() + "/exercise")
    //   .push(exerciseObjectData);
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
    const person = patientData;

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
                {/* {console.log("???", mySet)} */}
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
                          onClick={(e) => {
                            addExercise(e, i);
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
        <AppBar position="static" className={classes.appBar}>
          <img className={classes.tendonLogo} src="/img/tendonlogo.png"></img>
        </AppBar>
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
