import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../Firebase.js";
import { useLocation, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

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
    width: 250,
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
    width: 80,
    height: "calc(1.5em + .75rem + 2px)",
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  centeredCol: {
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#9DB4FF",
    color: "white",
    border: "none",
    height: "calc(1em + .75rem)",
    width: "calc(1em + .75rem)",
    "&:hover": {
      color: "white",
      backgroundColor: "#3358C4",
    },
    textAlign: "center",
    borderRadius: "50%",
    padding: 2,
    margin: 1,
  },
  loadingContainer: {
    textAlign: "center",
    paddingTop: "30vh",
  },
}));

const IndividualPatientView = (props) => {
  const classes = useStyles();
  // exerciseSets stores the "exercisesets" of the patient we are looking at
  const [exerciseSets, setExerciseSets] = useState([]);
  const [newExercise, setNewExercise] = useState("");
  const [newReps, setNewReps] = useState({});
  const [newDuration, setNewDuration] = useState({});
  const { id } = useParams();
  const currUser = useContext(UserContext).user;

  // For loading data, taken from PatientExerciseMain
  const [loaded, setLoaded] = useState(false);
  const [exerciseType, setExerciseType] = useState([]);

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

  const [validated, setValidated] = useState(false);
  const [validatedDay, setValidatedDay] = useState("");

  // Handle new patient with no exercisesets collection yet
  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      console.log("this runs");
      var collectionRef = db
        .collection("patients")
        .doc(currUser.uid)
        .collection("exercisesets")
        .limit(1);

      collectionRef.get().then((query) => {
        console.log("query size:", query.size);
        if (query.size === 0) {
          setLoaded(true);
        }
      });
    }
  }, [currUser]);

  // Use docID to retreive a specific patient's data from Firestore
  useEffect(() => {
    const fetchPatient = () => {
      // Newly added to load Firestore data
      console.log("location.patientInfo", location.patientInfo);
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
                // Append docId to each exercise to enable easy delete
                exercise.docId = doc1.id;
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
                console.log("fullset length", JSON.stringify(fullset.length));
                console.log("fullset", fullset);
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
    if (exerciseSets.length !== 0 && exerciseType.length !== 0) {
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

  // Fetch exercise type of this therapist
  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      const exerciseArr = [];
      db.collection("therapists")
        .doc(currUser.uid)
        .collection("exercises")
        .get()
        .then((querySnapshot) => {
          console.log(querySnapshot);
          querySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            exerciseArr.push({ ...data, id });
          });
        })
        .then(() => {
          setExerciseType(exerciseArr);
        });
    }
  }, [currUser]);

  const getUpdatedSet = async (day) => {
    console.log("current new Exercise: ", newExercise);
    console.log(exerciseType);
    let newEx = "";
    if (newExercise === "") newEx = exerciseType[0].name;
    else newEx = newExercise;
    const selectedExerciseType = await exerciseType.filter(
      (ex) => ex.name === newEx
    );
    console.log("Selected ExerciseType: ", selectedExerciseType);
    // Generate new exercise
    const exerciseObjectData = {
      id: 0,
      name: newEx,
      reps: parseInt(newReps[day]),
      duration: parseFloat(newDuration[day]),
      videoId: selectedExerciseType[0].videoId,
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

    const newExercise = await getUpdatedSet(setDay);
    console.log("newExercise", newExercise);

    // Firestore reference
    var dayRef = db.collection("patients").doc(id).collection("exercisesets");

    if (l == 0) {
      dayRef.doc(setDay).set({ day: setDay });
    }

    var patientRef = dayRef.doc(setDay).collection("exercises");

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

  // Delete exercise from firebase
  const deleteExercise = async (e, setDay, docId) => {
    // For debugging purposes - pauses refresh on submit
    e.preventDefault();

    console.log("Deleting!");
    console.log("docId", docId);

    // Firestore reference
    var exerciseRef = db
      .collection("patients")
      .doc(id)
      .collection("exercisesets")
      .doc(setDay)
      .collection("exercises")
      .doc(docId);

    exerciseRef
      .delete()
      .then(function () {
        console.log("Document successfuly deleted!");
        window.location.reload(false);
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
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
      let s = exerciseSets.find((element) => element.day == day);
      // Undefined if there are no matches
      if (s === undefined) {
        return [];
      }
      return s.exercise;
    };

    const canClick = (day) => {
      var r = document.getElementById("reps-" + day);

      console.log("what is r", r, r.value);
      console.log("newReps:", newReps);
      console.log("newDuration:", newDuration);

      // Make sure anything has been entered
      if (
        typeof newReps === "undefined" ||
        typeof newDuration === "undefined"
      ) { return false; }

      // Make sure values are entered for proper day
      if (
        typeof newReps[day] === "undefined" ||
        newReps[day] === "" ||
        typeof newDuration[day] === "undefined" ||
        newDuration[day] === ""
      ) 
      { 
        return false; }
      else {
        return true;
      }
    };

    const doNothing = (e, day) => {
      e.preventDefault();
      console.log("click cannot execute, do nothing");
      const form = e.currentTarget;
      console.log("This is the form that's being targeted: ", form);
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
      }

      setValidatedDay(day);
    };

    return (
      <div>
        <div>
          <Container>
            <Typography variant="h4" className={classes.header}>
              {/* {location.patientInfo.name} */}
              Week of 4/13 - Progress
            </Typography>
            {/* <div className={classes.accentDivider}></div> */}
            {/* {console.log("exerciseList", JSON.stringify(exerciseSets[0].exercise))} */}

            {/* Progress Chart */}
            <Row>
              {exerciseSets.length !== 0 ? (
                <React.Fragment>
                  <Col>Exercise Name</Col>

                  {exerciseSets[0].exerciseList.map((ex) => (
                    <Col className={classes.centeredCol}>{ex}</Col>
                  ))}
                </React.Fragment>
              ) : null}
              {exerciseSets.length === 0 ? (
                <Col>A new patient - add exercises below!</Col>
              ) : null}
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
                          <Col className={classes.centeredCol}>
                            <Button
                              variant="primary"
                              type="submit"
                              className={classes.deleteButton}
                              onClick={(e) => {
                                deleteExercise(e, day, ex.docId);
                              }}
                            >
                              X
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                  {console.log(day == validatedDay)}
                  <Form
                    noValidate
                    validated={day == validatedDay}
                    // onSubmit={handleSubmit}
                    id={`form1-${day}`}
                  >
                    <Row>
                      <Col>
                        <Form.Group controlId={`exampleForm${day}`}>
                          <Form.Control
                            as="select"
                            className={classes.exerciseBox}
                            onChange={(event) => {
                              setNewExercise(event.target.value);
                            }}
                          >
                            {console.log(
                              "exampleForm1",
                              document.getElementById("reps-Monday")
                            )}
                            {exerciseType.map((exercise, i) => {
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
                        <Form.Group>
                          <Form.Control
                            type="number"
                            min="0"
                            className={classes.inputBox}
                            id={`reps-${day}`}
                            onChange={(event) => {
                              let r = newReps;
                              const d = day;
                              r[d] = event.target.value;
                              setNewReps(r);
                            }}
                            required
                          />
                          {console.log("new reps??", newReps)}
                          <Form.Control.Feedback type="invalid">
                            Reps are required.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Control
                          as="input"
                          type="number"
                          min="1"
                          step="0.5"
                          className={classes.inputBox}
                          id={`dur-${day}`}
                          onChange={(event) => {
                            let dur = newDuration;
                            const d = day;
                            dur[d] = event.target.value;
                            setNewDuration(dur);
                          }}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Duration is required.
                        </Form.Control.Feedback>
                      </Col>
                      <Col className={classes.centeredCol}>
                        <Button
                          variant="primary"
                          type="submit"
                          // className={classes.blueButton}
                          // disabled={(typeof newReps === 'undefined' || typeof newDuration === 'undefined')}
                          onClick={(e) => {
                            canClick(day)
                              ? addExercise(e, day, checkMatch(day).length)
                              : doNothing(e, day);
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
      <Container className={classes.loadingContainer}>
        <CircularProgress />
      </Container>
    );
  };

  return <div>{loaded ? renderTable() : renderLoading()}</div>;
};

export default IndividualPatientView;
