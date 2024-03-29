import React, { useState, useEffect, useContext } from "react";
import Exercise from "./Exercise";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPlus,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { db } from "../../Firebase";
import { UserContext } from "../../contexts/UserContext";
import { formatExerciseName } from "../IndividualPatientView";
import { template } from "@babel/core";
import { useParams, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  exerciseContainer: {
    // when screen is small
    [theme.breakpoints.down("xs")]: {
      overflowX: "scroll",
    },
    marginTop: 30,
    marginBottom: 40,
    width: "90%",
    margin: "0 auto",
  },
  exerciseSetDiv: {
    minWidth: "1000px",
  },
  header: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    },
    marginTop: 10,
    marginBottom: 0,
    color: "#80858a",
  },
  rows: {
    marginTop: 10,
  },
  paramCols: {
    textAlign: "center",
    width: 30,
  },
  exerciseBox: {
    minWidth: 250,
  },
  firstCol: {
    minWidth: 270,
  },
  cols: {
    // marginRight: 100,
    textAlign: "center",
  },
  centeredCol: {
    textAlign: "center",
  },
  loadingContainer: {
    textAlign: "center",
    paddingTop: "30vh",
  },
  newExercise: {
    marginTop: 10,
  },
  inputBox: {
    width: 80,
    height: "calc(1.5em + .75rem + 2px)",
    borderRadius: 5,
    border: "1px solid #ccc",
    display: "inline-block",
  },
  accentDivider: {
    content: "",
    display: "block",
    width: "6.25rem",
    height: ".325rem",
    marginTop: "1.5rem",
    background: "#9DB4FF",
    marginBottom: "1.75rem",
  },
  nameField: {
    marginBottom: 20,
    width: "20%",
    height: "15%",
  },
  resize: {
    fontSize: 22,
  },
  blueButton: {
    backgroundColor: "#3358C4",
    color: "white",
    border: "none",
    height: "calc(1.5em + .75rem + 2px)",
    "&:hover": {
      color: "white",
      backgroundColor: "#9DB4FF",
    },
    margin: 4,
  },
}));

const TemplateEdit = () => {
  //Input states
  const [newExercise, setNewExercise] = useState("");
  const [newReps, setNewReps] = useState({});
  const [newDuration, setNewDuration] = useState({});
  const [newSets, setNewSets] = useState({});
  const [newHold, setNewHold] = useState({});
  const [newResistance, setNewResistance] = useState(null);
  const [newRest, setNewRest] = useState({});
  const [templateExercises, setTemplateExercises] = useState([]);
  const [templateName, setTemplateName] = useState("");

  const currUser = useContext(UserContext).user;
  const classes = useStyles();

  // For loading data, taken from PatientExerciseMain
  const [loaded, setLoaded] = useState(false);
  const [exerciseType, setExerciseType] = useState([]);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const type = localStorage.getItem("type");
    if (type && type === "patients") history.push("/workout");
  }, []);
  // Fetch exercise type of this therapist
  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      const exerciseArr = [];
      db.collection("therapists")
        .doc(currUser.uid)
        .collection("exercises")
        .get()
        .then((querySnapshot) => {
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

  //fetch template exercises
  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      const template = db
        .collection("therapists")
        .doc(currUser.uid)
        .collection("templates")
        .doc(id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log("No such document!");
          } else {
            console.log("Document data:", doc.data());
            setTemplateExercises(doc.data().exercises);
            setTemplateName(doc.data().name);
          }
        });
    }
  }, [currUser]);

  // useEffect(() => {
  //     if (templateExercises.length !== 0 && exerciseType.length !== 0) {
  //       setLoaded(true);
  //     }
  //   }, [templateExercises]);

  const getUpdatedSet = async () => {
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
      name: newEx,
      reps: parseInt(newReps),
      duration: parseFloat(newDuration),
      sets: parseInt(newSets),
      hold: parseInt(newHold),
      resistance: newResistance,
      rest: parseInt(newRest),
      videoId: selectedExerciseType[0].videoId,
      complete: false,
    };

    return exerciseObjectData;
  };

  const deleteExercise = async (e, ind) => {
    // For debugging purposes - pauses refresh on submit
    e.preventDefault();

    console.log("Deleting!");
    console.log("exercise number", ind);

    setTemplateExercises(
      templateExercises.filter(function (value, index) {
        return index !== ind;
      })
    );
    console.log("template exercises after del", templateExercises);
  };

  const addExercise = async (e) => {
    // For debugging purposes - pauses refresh on submit
    e.preventDefault();

    // var currTempExercises = templateExercises;
    const newExercise = await getUpdatedSet();
    console.log("newExercise", newExercise);

    const updatedTemplate = templateExercises.concat(newExercise);
    setTemplateExercises(updatedTemplate);
    console.log("new template exercises", templateExercises);

    //reset params
    // setNewExercise(exerciseType[0].name);
    setNewReps({});
    setNewDuration({});
    setNewSets({});
    setNewHold({});
    setNewResistance("");
    setNewRest({});
  };

  const updateTemplate = async (e) => {
    // For debugging purposes - pauses refresh on submit
    e.preventDefault();

    const newTemplate = {
      name: templateName,
      exercises: templateExercises,
    };
    console.log("new template", newTemplate);

    const templateRef = db
      .collection("therapists")
      .doc(currUser.uid)
      .collection("templates")
      .doc(id)
      .update(newTemplate)
      .then(function () {
        console.log("Document successfully written!");
        history.push("/PT/exercises");
      })
      .catch(function (error) {
        console.error("Error: updating document: ", error);
      });

    // // Add to exercises
    // await templateRef
    //   .add(newTemplate)
    //   .then(function (docRef) {
    //     console.log("Exercise document written with ID: ", docRef.id);
    //     alert("Template successfully created");
    //   })
    //   .catch(function (error) {
    //     console.error("Error writing document: ", error);
    //   });
    // Should only reload if previous chunk of code has run..
    // window.location.reload(false);
  };

  return (
    <div className={classes.exerciseContainer}>
      <div className={classes.exerciseSetDiv}>
        <Typography variant="h4" className={classes.header}>
          Edit {templateName} Template
        </Typography>
        <div className={classes.accentDivider} />

        <form noValidate autoComplete="off">
          <TextField
            id="template-name"
            label="Template Name"
            className={classes.nameField}
            onChange={(e) => setTemplateName(e.target.value)}
            helperText="Template name required"
            value={templateName}
            InputProps={{
              classes: {
                input: classes.resize,
              },
            }}
          />
        </form>

        <div>
          <Row className={classes.rows}>
            <Col className={classes.firstCol}>Exercise</Col>
            <Col className={classes.paramCols}>Reps</Col>
            <Col className={classes.paramCols}>Sets</Col>
            <Col className={classes.paramCols}>Duration (s)</Col>
            <Col className={classes.paramCols}>Hold (s)</Col>
            <Col className={classes.paramCols}>Rest (s)</Col>
            <Col className={classes.paramCols}>Resistance</Col>
            {/* Keep extra column for add/delete button */}
            <Col></Col>
          </Row>
        </div>

        <Divider />
        {templateExercises.map((ex, k) => {
          console.log(templateExercises);
          return (
            <div>
              <Row key={k} className={classes.rows}>
                <Col className={classes.firstCol}>{formatExerciseName(ex.name)}</Col>
                <Col className={classes.cols}>{ex.reps ? ex.reps : "-"}</Col>
                <Col className={classes.cols}>{ex.sets ? ex.sets : "-"}</Col>
                <Col className={classes.cols}>
                  {ex.duration ? ex.duration : "-"}
                </Col>
                <Col className={classes.cols}>{ex.hold ? ex.hold : "-"}</Col>
                <Col className={classes.cols}>{ex.rest ? ex.rest : "-"}</Col>
                <Col className={classes.cols}>
                  {ex.resistance ? ex.resistance : "-"}
                </Col>
                <Col className={classes.centeredCol}>
                  <Button
                    variant="light"
                    onClick={(e) => {
                      deleteExercise(e, k);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} color="#9DB4FF" size="2x" />
                  </Button>
                </Col>
              </Row>
            </div>
          );
        })}
        <Form
          // noValidate
          // validated={day == validatedDay}
          // onSubmit={handleSubmit}
          id={`form1-template`}
          className={classes.newExercise}
        >
          <Row>
            <Col>
              <Form.Group controlId={`exampleFormTemplate`}>
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
                      <option value={exercise.name}>{exercise.name}</option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col className={classes.centeredCol}>
              <Form.Group>
                <Form.Control
                  type="number"
                  min="0"
                  className={classes.inputBox}
                  id={`reps-template`}
                  onChange={(event) => {
                    var r = event.target.value;
                    setNewReps(r);
                  }}
                  required
                  value={newReps}
                />
                {console.log("new reps", newReps)}
                <Form.Control.Feedback type="invalid">
                  Reps are required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col className={classes.centeredCol}>
              <Form.Group>
                <Form.Control
                  type="number"
                  min="0"
                  className={classes.inputBox}
                  id={`sets-template`}
                  onChange={(event) => {
                    var s = event.target.value;
                    setNewSets(s);
                  }}
                  value={newSets}
                  required
                />
                {console.log("new sets", newSets)}
                <Form.Control.Feedback type="invalid">
                  Sets are required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col className={classes.centeredCol}>
              <Form.Control
                as="input"
                type="number"
                min="1"
                step="0.5"
                className={classes.inputBox}
                id={`dur-template`}
                onChange={(event) => {
                  var dur = event.target.value;
                  setNewDuration(dur);
                }}
                value={newDuration}
                required
              />
              {console.log("new duration", newDuration)}
              <Form.Control.Feedback type="invalid">
                Duration is required.
              </Form.Control.Feedback>
            </Col>
            <Col className={classes.centeredCol}>
              <Form.Group>
                <Form.Control
                  type="number"
                  min="0"
                  className={classes.inputBox}
                  id={`holds-template`}
                  onChange={(event) => {
                    var h = event.target.value;
                    setNewHold(h);
                  }}
                  value={newHold}
                  required
                />
                {console.log("new hold", newHold)}
                <Form.Control.Feedback type="invalid">
                  Hold is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col className={classes.centeredCol}>
              <Form.Group>
                <Form.Control
                  type="number"
                  min="0"
                  className={classes.inputBox}
                  id={`rest-template`}
                  onChange={(event) => {
                    var rest = event.target.value;
                    setNewRest(rest);
                  }}
                  value={newRest}
                  required
                />
                {console.log("new rest", newRest)}
                <Form.Control.Feedback type="invalid">
                  Rest is required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col className={classes.centeredCol}>
              <Form.Group>
                <Form.Control
                  type="text"
                  className={classes.inputBox}
                  id={`resistance-template`}
                  onChange={(event) => {
                    var resistance = event.target.value;
                    setNewResistance(resistance);
                  }}
                  value={newResistance}
                  required
                />
                {console.log("new resistance", newResistance)}
                <Form.Control.Feedback type="invalid">
                  Resistance are required.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col className={classes.centeredCol}>
              <Button
                variant="light"
                type="submit"
                onClick={(e) => {
                  addExercise(e);
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
        <Button
          color="primary"
          className={classes.blueButton}
          onClick={() => history.goBack()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className={classes.blueButton}
          onClick={(e) => updateTemplate(e)}
        >
          Update Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateEdit;
