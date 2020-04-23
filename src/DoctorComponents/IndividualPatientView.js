import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PresetExercisesData from "../ModelJSON/PresetExercises.json";
import { db } from "../Firebase.js";
import { useLocation, useParams } from "react-router-dom";

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
  checkIcon: {
    maxWidth: 35,
  },
  inputBox: {
    width: 50,
    height: "calc(1.5em + .75rem + 2px)",
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  centeredCol: {
    textAlign: "center",
  },
  // // For Grid
  // root: {
  //   flexGrow: 1,
  // },
  // paper: {
  //   padding: theme.spacing(2),
  //   textAlign: "center",
  //   color: theme.palette.text.secondary,
  // },
  // // End for grid
}));

const IndividualPatientView = (props) => {
  const classes = useStyles();
  // exerciseSets stores the "exercisesets" of the patient we are looking at
  const [exerciseSets, setExerciseSets] = useState([]);
  const [newExercise, setNewExercise] = useState("Calf Wall Stretch");
  const [newReps, setNewReps] = useState(1);
  const [newDuration, setNewDuration] = useState(5);
  const { id } = useParams();

  // For loading data, taken from PatientExerciseMain
  const [loaded, setLoaded] = useState(false);

  // Load eventually
  // window.setTimeout(setLoaded(true), 2000);

  const dotw = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const location = useLocation();

  // Use docID to retreive a specific patient's data from Firestore
  useEffect(() => {
    const fetchPatient = () => {
      // Newly added to load Firestore data
      console.log(location.patientInfo);
      var patientRef = db
        .collection("patients")
        .doc(id)
        .collection("exercisesets");

      // Newly added to load Firestore data
      var fullset = [];
      var l = [];
      patientRef.get().then((querySnapshot) => {
        // For each set
        querySnapshot.forEach((doc) => {
          const day = doc.data().day;
          var ex = [];
          // Nested inner
          patientRef
            .doc(doc.id)
            .collection("exercises")
            .get()
            .then((snap) => {
              snap.forEach((doc1) => {
                const exercise = doc1.data();
                console.log("exercise.name", exercise.name);
                ex.push(exercise);
                if (!l.includes(exercise.name)) {
                  l.push(exercise.name);
                  console.log("l now", l);
                  // setExerciseList(l); // this causes ExerciseSets to be incorrect
                }
              });
            })
            .then(() => {
              console.log("THis is L: ", JSON.stringify(l));
              fullset.push({ day: day, exercise: ex, exerciseList: l });
              // When everything's fully loaded
              if (querySnapshot.docs.length === fullset.length) {
                console.log("fullset", JSON.stringify(fullset.length));
                setExerciseSets(fullset);
              }
            });
        });
      });
    };

    fetchPatient();
  }, []);

  // last line refers to how this useEffect will rerun if value of foundDID changes
  useEffect(() => {
    if (exerciseSets.length !== 0) {
      setLoaded(true);
    }
  }, [exerciseSets]);
  // End loading data

  // const findExercise = (exercise) => {
  //     const exercises = Object.values(PresetExercisesData);
  //     for (var i = 0; i < exercises.length; i++) {
  //         if (exercises[i].name === exercise) {
  //             return exercises[i];
  //         }
  //     }
  // }

  const getUpdatedSet = () => {
    // Generate new exercise
    var exerciseObjectData = {
      id: 0,
      name: newExercise,
      reps: parseInt(newReps),
      duration: parseFloat(newDuration),
      videoId: "MW2WG5l-fYE",
      complete: false,
    };
    // var exerciseObjectData = findExercise(newExercise);
    console.log("Adding this exercise to firebase! :)", newExercise);

    return exerciseObjectData;
  };

  // Submit new exercise to firebase
  const addExercise = async (e, setDay, l) => {
    // For debugging purposes - pauses refresh on submit
    e.preventDefault();

    const newExercise = await getUpdatedSet();
    console.log("newExercise", newExercise);

    // Firestore reference
    var dayRef = db
      .collection("patients")
      .doc(id)
      .collection("exercisesets")

    if (l == 0) {
      dayRef.doc(setDay).set({ day: setDay });
    }

    var patientRef = dayRef
      .doc(setDay)
      .collection("exercises");

    patientRef
      .add(newExercise)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        window.location.reload(false);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  // Repeat function from PatientExerciseMain
  const calculateTotalTime = (s) => {
    var t = 0;
    console.log("len", s.exercise);
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
    // Return true, false, or - (not an exercise for this day)
    const checkComplete = (exercises, exname) => {
      // Iterate through set for the day
      for (let i = 0; i < exercises.length; i++) {
        if (exercises[i].name === exname) {
          // Return bool
          if (exercises[i].complete) {
            return (
              <img className={classes.checkIcon} src="/img/complete.png"></img>
            );
          } else {
            return (
              <img
                className={classes.checkIcon}
                src="/img/incomplete.png"
              ></img>
            );
          }
        }
      }
      return "-";
    };

    const checkMatch = (day) => {
      // .find returns the element that matches
      let s = exerciseSets.find(element => element.day == day);
      // Undefined if there are no matches
      if (s === undefined) {
        return [];
      }
      return s.exercise;
    }

    return (
      <div>
        <div>
          <Container>
            <Typography variant="h4" className={classes.header}>
              Week of 4/13 - Progress
            </Typography>
            {/* <div className={classes.accentDivider}></div> */}
            {console.log(
              "exerciseList",
              JSON.stringify(exerciseSets[0].exercise)
            )}

            {/* Progress Chart */}
            <Row>
              <Col>Exercise Name</Col>
              {exerciseSets
                ? exerciseSets[0].exerciseList.map((ex) => (
                  <Col className={classes.centeredCol}>{ex}</Col>
                ))
                : null}
            </Row>

            <Divider />
          </Container>

          {exerciseSets.map((s, i) => {
            return (
              <Container>
                <Row key={i}>
                  <Col>{s["day"]}</Col>
                  {/* Map through each column */}
                  {s.exerciseList.map((name, i) => {
                    return (
                      <Col className={classes.centeredCol}>
                        {checkComplete(s.exercise, name)}
                      </Col>
                    );
                  })}
                </Row>
              </Container>
            );
          })}
          {/* End Progress Chart */}

          {dotw.map((day, ind) => {
            return (
              <div>
                <Container className={classes.exerciseContainer} key={ind}>
                  <Typography variant="h4" className={classes.header}>
                    {day} Exercises
                    {console.log("exerciseSets", exerciseSets)}
                  </Typography>
                  <Row>
                    <Col>Exercise</Col>
                    <Col>Reps</Col>
                    <Col>Duration</Col>
                    <Col></Col>
                  </Row>
                  <Divider />

                  {console.log("checkMatch:", day, checkMatch(day))}
                  {checkMatch(day).map((ex, k) => {
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
                            addExercise(e, day, checkMatch(day).length);
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
