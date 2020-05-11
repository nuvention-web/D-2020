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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faTimes,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

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
  exerciseContainer: {
    marginTop: 30,
  },
  link: {
    //gets rid of underline
    textDecoration: "none !important",
    textAlign: "right",
  },
  stretchGraphic: {
    height: 225,
    marginLeft: 15,
    marginTop: 55,
  },
  exerciseBox: {
    width: 100,
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
  loadingContainer: {
    textAlign: "center",
    paddingTop: "30vh",
  },
  rows: {
    marginTop: 10,
  },
  newExercise: {
    marginTop: 10,
  },
  deleteIcon: {
    "&:hover": {
      color: "#8ca1e6",
    },
  },
  viewHistory: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 120,
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cols: {
    // marginRight: 100,
    textAlign: "center",
  },
}));

export const dayToNumIdMap = new Map([
  ["Sunday", 0],
  ["Monday", 1],
  ["Tuesday", 2],
  ["Wednesday", 3],
  ["Thursday", 4],
  ["Friday", 5],
  ["Saturday", 6],
]);

//to sort exercisesets
export const compareSets = (a, b) => {
  const dayA = a.day;
  const dayB = b.day;

  let comparison = 0;
  if (dayToNumIdMap.get(dayA) > dayToNumIdMap.get(dayB)) {
    comparison = 1;
  } else if (dayToNumIdMap.get(dayA) < dayToNumIdMap.get(dayB)) {
    comparison = -1;
  }

  return comparison;
};

const IndividualPatientView = (props) => {
  const classes = useStyles();
  // exerciseSets stores the "exercisesets" of the patient we are looking at
  const [exerciseSets, setExerciseSets] = useState([]);
  const [newExercise, setNewExercise] = useState("");

  // Input States
  const [newReps, setNewReps] = useState({});
  const [newDuration, setNewDuration] = useState({});
  const [newSets, setNewSets] = useState({});
  const [newHold, setNewHold] = useState({});
  const [newResistance, setNewResistance] = useState({});
  const [newRest, setNewRest] = useState({});

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
                }
              });
            })
            .then(() => {
              fullset.push({ day: day, exercise: ex, exerciseList: l });
              // When everything's fully loaded
              if (querySnapshot.docs.length === fullset.length) {
                fullset.sort(compareSets);
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

    // Retrieve name of new exercise
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
      sets: newSets[day],
      hold: parseInt(newHold[day]),
      resistance: newResistance[day],
      rest: parseInt(newRest[day]),
      videoId: selectedExerciseType[0].videoId,
      complete: false,
    };
    // var exerciseObjectData = findExercise(newExercise);
    console.log("Adding this exercise to firebase! :)", newExercise);

    // To find the date we are adding the exercise to
    console.log("day", day);
    console.log("index of day", dayToNumIdMap.get(day));

    var n = new Date();
    // Today's index - setDay's index
    console.log('n.getDay()', n.getDay())

    const diff = n.getDay() - dayToNumIdMap.get(day);
    console.log("diff", diff);

    // Diff will be neg. if in the future
    // Can only add exercises to future week
    n = new Date(n.setDate(n.getDate() - diff));
    console.log("n", n);

    // For history object
    const historyObjectData = {
      date: n,
      exercise: newEx,
    };

    return [exerciseObjectData, historyObjectData];
  };

  // Submit new exercise to firebase
  const addExercise = async (e, setDay, l) => {
    // For debugging purposes - pauses refresh on submit
    e.preventDefault();

    const [newExercise, newHistory] = await getUpdatedSet(setDay);
    console.log("newExercise", newExercise);
    console.log("newHistory", newHistory);

    // Firestore reference
    var dayRef = db.collection("patients").doc(id).collection("exercisesets");

    if (l == 0) {
      dayRef.doc(setDay).set({ day: setDay });
    }

    // Add to exercisesets
    var patientRef = dayRef.doc(setDay).collection("exercises");

    patientRef
      .add(newExercise)
      .then(function (docRef) {
        console.log("Exercise document written with ID: ", docRef.id);

        // Add docRef.id to history to double check
        // newHistory.exerciseDocId = docRef.id;
        // console.log("newHistory right before:", newHistory);

        // Add history doc (w/ random generated id)
        db.collection("patients")
          .doc(id)
          .collection("history")
          .add(newHistory)
          .then(function (historyRef) {
            console.log("History document sucessfully written!", historyRef.id);

            // Now, in new exercise, set historyId to historyRef.id
            console.log('docRef here', docRef.id);
            patientRef.doc(docRef.id)
              .set({ historyId: historyRef.id }, { merge: true })
              .then(function () {
                console.log("historyId added to exercise!");
                window.location.reload(false);
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              });
            // End setting historyId to new exercise

          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
        // End add to history

      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  // Delete exercise from firebase
  const deleteExercise = async (e, setDay, docId, historyId) => {
    // For debugging purposes - pauses refresh on submit
    e.preventDefault();

    console.log("Deleting!");
    console.log("docId", docId);
    console.log("historyId", historyId)
    console.log('id in deleteExercise', id);
    // Check if we should delete history first

    const checkHistory = () => {
      db.collection("patients")
      .doc(id)
      .collection("history")
      .doc(historyId)
      .get().then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          // If same week, delete history doc
          // Same week if before next Monday 3 am 
          var today = new Date();
          var day = today.getDay(); // day of the week 0-6
          const diff = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

          // Monday of this week
          var mon = new Date();
          mon.setDate(diff);
          // var nextMon = new Date(mon.getTime() + 7 * 24 * 60 * 60 * 1000);
          var thisMon = new Date(mon.getTime());
          console.log('this Monday', thisMon);
          console.log('thisMon.getTime()', thisMon.getTime())

          // Timestamp of history document, in milliseconds
          const historyTime = doc.data().date.seconds * 1000;
          console.log('historyTime', historyTime)
          console.log('historyTime date', Date(historyTime))

          // Exercise being deleted within same week, delete history
          if (historyTime > thisMon) {
            console.log("same week!");

            // Delete history
            db.collection("patients")
              .doc(id)
              .collection("history")
              .doc(historyId)
              .delete()
              .then(function () {
                console.log("History doc deleted");
                return true;
              })
              .catch(function (error) {
                console.error("Error deleting document: ", error);
              });
            // End Delete history
          }
          else {
            return true;
          }
          // If different week, do nothing
        } else {
          // doc.data() will be undefined in this case
          console.log("No such history document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
    // end checkHistory function

    const done = await checkHistory();
    console.log('done', done);
   
    // Now delete exercise document
    var exerciseRef = db
      .collection("patients")
      .doc(id)
      .collection("exercisesets")
      .doc(setDay)
      .collection("exercises")
      .doc(docId);

    await exerciseRef
      .delete()
      .then(function () {
        console.log("Document successfuly deleted!");

      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
    // End delete exercise doc
    
    // Should only reload if previous chunk of code has run..
    window.location.reload(false);

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

  const getMonday = (d) => {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var dateStr = month + "/" + date + "/" + year;
    return dateStr;
  };
  const weekBeginning = getMonday(new Date());

  const formatExerciseName = (n) => {
    var splitStr = n.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  };

  const generateID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  const renderItems = () => {
    // Return true, false, or - (not an exercise for this day)
    const checkExComplete = (exercises, exname) => {
      // Iterate through set for the day
      for (let i = 0; i < exercises.length; i++) {
        if (exercises[i].name === exname) {
          // Return bool
          if (exercises[i].complete) {
            const uuid = generateID();
            return (
              <div>
                <img
                  className={classes.checkIcon}
                  src="/img/complete.png"
                  data-tip
                  data-for={`${uuid}`}
                ></img>
                <ReactTooltip effect="solid" id={`${uuid}`}>
                  <div> Pain Level: {String(exercises[i].painLevel)} </div>
                  <div> Note: {String(exercises[i].note)} </div>
                </ReactTooltip>
              </div>
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
      ) {
        return false;
      }

      // Make sure values are entered for proper day
      if (
        typeof newReps[day] === "undefined" ||
        newReps[day] === "" ||
        typeof newDuration[day] === "undefined" ||
        newDuration[day] === ""
      ) {
        return false;
      } else {
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
            <header className={classes.progressHeader}>
              <Typography variant="h4" className={classes.header}>
                Week of {weekBeginning} Progress
              </Typography>
              <Link
                to={{
                  pathname: `/PT/patient/${id}/history`,
                }}
                className={classes.link}
              >
                <Button variant="light" className={classes.viewHistory}>
                  View History
                </Button>
              </Link>
            </header>

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
                        {checkExComplete(s.exercise, name)}
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
                  </Typography>
                  <div>
                    <Row className={classes.rows}>
                      <Col>Exercise</Col>
                      <Col>Reps</Col>
                      <Col>Duration(min)</Col>
                      <Col>Sets</Col>
                      <Col>Hold(min)</Col>
                      <Col>Resistance</Col>
                      <Col>Rest(min)</Col>
                      {/* Keep extra column for add/delete button */}
                      <Col></Col>
                    </Row>
                  </div>

                  <Divider />

                  {console.log("checkMatch:", day, checkMatch(day))}
                  {checkMatch(day).map((ex, k) => {
                    return (
                      <div>
                        <Row key={k} className={classes.rows}>
                          <Col>{formatExerciseName(ex.name)}</Col>
                          <Col className={classes.cols}>
                            {ex.reps ? ex.reps : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.duration ? ex.duration : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.sets ? ex.sets : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.hold ? ex.hold : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.resistance ? ex.resistance : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.rest ? ex.rest : "-"}
                          </Col>
                          {console.log('ex', ex)}
                          {console.log('??historyId', ex.historyId)}

                          <Col className={classes.centeredCol}>
                            <FontAwesomeIcon
                              icon={faTimes}
                              color="#9DB4FF"
                              size="2x"
                              className={classes.deleteIcon}
                              onClick={(e) => {
                                deleteExercise(e, day, ex.docId, ex.historyId);
                              }}
                            />
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
                    className={classes.newExercise}
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
                      <Col>
                        <Form.Group>
                          <Form.Control
                            type="number"
                            min="0"
                            className={classes.inputBox}
                            id={`sets-${day}`}
                            onChange={(event) => {
                              let s = newSets;
                              const d = day;
                              s[d] = event.target.value;
                              setNewSets(s);
                            }}
                            required
                          />
                          {console.log("new sets??", newSets)}
                          <Form.Control.Feedback type="invalid">
                            Sets are required.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            type="number"
                            min="0"
                            className={classes.inputBox}
                            id={`holds-${day}`}
                            onChange={(event) => {
                              let h = newHold;
                              const d = day;
                              h[d] = event.target.value;
                              setNewHold(h);
                            }}
                            required
                          />
                          {console.log("new reps??", newReps)}
                          <Form.Control.Feedback type="invalid">
                            Hold is required.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            className={classes.inputBox}
                            id={`resistance-${day}`}
                            onChange={(event) => {
                              let resistance = newResistance;
                              const d = day;
                              resistance[d] = event.target.value;
                              setNewResistance(resistance);
                            }}
                            required
                          />
                          {console.log("new resistance??", newResistance)}
                          <Form.Control.Feedback type="invalid">
                            Resistance are required.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Control
                            type="number"
                            min="0"
                            className={classes.inputBox}
                            id={`rest-${day}`}
                            onChange={(event) => {
                              let rest = newRest;
                              const d = day;
                              rest[d] = event.target.value;
                              setNewRest(rest);
                            }}
                            required
                          />
                          {console.log("new rest??", newRest)}
                          <Form.Control.Feedback type="invalid">
                            Sets are required.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col className={classes.centeredCol}>
                        <Button
                          variant="light"
                          type="submit"
                          className={classes.addButton}
                          // disabled={(typeof newReps === 'undefined' || typeof newDuration === 'undefined')}
                          onClick={(e) => {
                            canClick(day)
                              ? addExercise(e, day, checkMatch(day).length)
                              : doNothing(e, day);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            color="#3358C4"
                            size="2x"
                            type="submit"
                          />
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
          {/* <Link to="/PT" className={classes.link}>
            <Button className={classes.blueButton} variant="outline-primary"> */}
          {/* <img className={classes.arrowIcon} src="/img/arrowleft.png"></img> */}
          {/* Back
            </Button>
          </Link> */}
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
