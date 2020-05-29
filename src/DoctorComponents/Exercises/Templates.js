import React, { useState, useEffect, useContext } from "react";
import Exercise from "./Exercise";
import { makeStyles } from "@material-ui/core/styles";
import { Container, 
        Typography, 
        Grid, 
        Divider, 
        CircularProgress,
        TextField} from "@material-ui/core";
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
    exerciseBox: {
        width: 100,
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
        marginBottom: "1.75rem"
    },
    nameField: {
        marginBottom: 20,
        width: "20%",
        height: "15%"
    },
    resize: {
        fontSize: 22,
    }, 
    submitBtn: {
        marginTop: "5%"
    }
}));




const Templates = () => {
    //Input states
    const [newExercise, setNewExercise] = useState("");
    const [newReps, setNewReps] = useState({});
    const [newDuration, setNewDuration] = useState({});
    const [newSets, setNewSets] = useState({});
    const [newHold, setNewHold] = useState({});
    const [newResistance, setNewResistance] = useState({});
    const [newRest, setNewRest] = useState({});
    const [templateExercises, setTemplateExercises] = useState([]);
    const [templateName, setTemplateName] = useState("");

    const currUser = useContext(UserContext).user;
    const classes = useStyles();

    // For loading data, taken from PatientExerciseMain
    const [loaded, setLoaded] = useState(false);
    const [exerciseType, setExerciseType] = useState([]);

    //fetch  
    // useEffect(() => {
    //     currentExercises = templateExercises;
        
    // }, [templateExercises]);

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
          dateAdded: new Date(),
        };
    
        return exerciseObjectData;
    };

    const deleteExercise = async (e, ind) => {
        // For debugging purposes - pauses refresh on submit
        // e.preventDefault();
    
        console.log("Deleting!");
        console.log("exercise number", ind);

        var currTempExercises = templateExercises;
        currTempExercises.splice(ind, 1);
        console.log(currTempExercises);
        setTemplateExercises(currTempExercises);

    
        // // Should only reload if previous chunk of code has run..
        // window.location.reload(false);
    };

    const addExercise = async (e) => {
        // For debugging purposes - pauses refresh on submit
        // e.preventDefault();
    
        const newExercise = await getUpdatedSet();
        console.log("newExercise", newExercise);

        var currTempExercises = templateExercises;
        currTempExercises.push(newExercise);
        console.log(currTempExercises);
        setTemplateExercises(currTempExercises);
        console.log("new template exercises", templateExercises);
    
        // // Should only reload if previous chunk of code has run..
        // window.location.reload(false);
    };
    
    

    return(
        <div className={classes.exerciseContainer}>
            <div className={classes.exerciseSetDiv}>
                <Typography variant="h4" className={classes.header}>
                    Create a New Template
                </Typography>
                <div className={classes.accentDivider}/>

                <form noValidate autoComplete="off">
                    <TextField id="template-name" 
                                label="Template Name" 
                                className={classes.nameField}
                                onChange={(e) => setTemplateName("name", e.target.value)}
                                helperText="Template name required"
                                InputProps={{
                                    classes: {
                                      input: classes.resize,
                                }}}/>
                </form>

                <div>
                <Row className={classes.rows}>
                    <Col>Exercise</Col>
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
                {console.log("templateExercises", templateExercises)}
                { 
                    templateExercises.map((ex, k) => {
                
                    return(
                    <div>
                    <Row key={k} className={classes.rows}>
                        {console.log("exercise name", formatExerciseName(ex.name))}
                        <Col>{formatExerciseName(ex.name)}</Col>
                        <Col className={classes.cols}>
                        1
                        {/* {ex.reps ? ex.reps : "-"} */}
                        </Col>
                        <Col className={classes.cols}>
                        1
                        {/* {ex.sets ? ex.sets : "-"} */}
                        </Col>
                        <Col className={classes.cols}>
                        1
                        {/* {ex.duration ? ex.duration : "-"} */}
                        </Col>
                        <Col className={classes.cols}>
                        1
                        {/* {ex.hold ? ex.hold : "-"} */}
                        </Col>
                        <Col className={classes.cols}>
                        1
                        {/* {ex.rest ? ex.rest : "-"} */}
                        </Col>
                        <Col className={classes.cols}>
                        1
                        {/* {ex.resistance ? ex.resistance : "-"} */}
                        </Col>
                        <Col className={classes.centeredCol}>
                            <Button
                            variant="light"
                            onClick={(e) => {
                                deleteExercise(e, k);
                            }}
                            >
                            <FontAwesomeIcon
                                icon={faTimes}
                                color="#9DB4FF"
                                size="2x"
                            />
                            </Button>
                        </Col>
                    </Row>
                    </div>
                    );
                }) }
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
                                <option value={exercise.name}>
                                {exercise.name}
                                </option>
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
                            addExercise(e)
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

                <Button variant="light" type="submit" className={classes.submitBtn}>
                    Create Template
                </Button>
            </div>
            </div>
        );
}

export default Templates;