import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Divider,
  CircularProgress,
  Modal,
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
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import TempModal from "./Modal/TempModal";
const useStyles = makeStyles((theme) => ({
  exercises: {
    marginTop: 15,
    minWidth: 250,
  },
  header: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    },
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
  buttonInline: {
    display: "inline-block",
  },
  checkIcon: {
    maxWidth: 35,
  },
  inputBox: {
    width: 80,
    height: "calc(1.5em + .75rem + 2px)",
    borderRadius: 5,
    border: "1px solid #ccc",
    display: "inline-block",
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
  paramCols: {
    textAlign: "center",
  },
  newExercise: {
    marginTop: 10,
  },
  deleteButton: {
    "&:hover": {
      color: "#8ca1e6",
    },
  },
  viewHistory: {
    [theme.breakpoints.down("sm")]: {
      width: 80,
      fontSize: 16,
    },
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 120,
  },
  progressHeader: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    },
    width: "90%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "5%",
  },
  cols: {
    // marginRight: 100,
    textAlign: "center",
  },
  progressContainer: {
    // when screen is small
    [theme.breakpoints.down("xs")]: {
      overflowX: "scroll",
    },
    marginTop: 15,
    marginBottom: 40,
    width: "90%",
    margin: "0 auto",
  },
  progressDiv: {
    minWidth: "1000px",
  },
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
  emphasis: {
    color: "#3358C4",
    fontWeight: 600,
  },
  descripContainer: {
    // when screen is small
    [theme.breakpoints.down("xs")]: {
      overflowX: "scroll",
    },
    marginTop: 60,
    marginBottom: 40,
    width: "90%",
    margin: "0 auto",
  },
  descripDiv: {
    minWidth: "700px",
  },
  date: {
    textAlign: "center",
    margin: "0 auto",
  },
  arrowButton: {
    // [theme.breakpoints.down("sm")]: {
    //   width: 80,
    //   fontSize: 16,
    // },
    display: "inline-block",
    // flexDirection: "row",
    alignItems: "left",
    width: 40,
    margin: 30,
  },
  paper: {
    position: "absolute",
    width: 1000,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  tempPaper: {
    position: "absolute",
    width: 700,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modalStyle: {
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
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

const numToDayMap = new Map([
  [0, "Sunday"],
  [1, "Monday"],
  [2, "Tuesday"],
  [3, "Wednesday"],
  [4, "Thursday"],
  [5, "Friday"],
  [6, "Saturday"],
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

const compareDate = (a, b) => {
  const dateA = a.dateAdded == undefined ? 0 : a.dateAdded;
  const dateB = b.dateAdded == undefined ? -1 : b.dateAdded;

  let comparison = 0;
  if (dateA > dateB) {
    comparison = 1;
  } else if (dateA <= dateB) {
    comparison = -1;
  }

  return comparison;
};

export const formatExerciseName = (n) => {
  var splitStr = n.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
};

const getModalStyle = () => {
  return {
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
  };
};

const IndividualPatientView = (props) => {
  const classes = useStyles();
  // exerciseSets stores the "exercisesets" of the patient we are looking at
  const [exerciseSets, setExerciseSets] = useState([]);

  // Input States
  const [newExercise, setNewExercise] = useState("");
  const [newReps, setNewReps] = useState({});
  const [newDuration, setNewDuration] = useState({});
  const [newSets, setNewSets] = useState({});
  const [newHold, setNewHold] = useState({});
  const [newResistance, setNewResistance] = useState({});
  const [newRest, setNewRest] = useState({});

  // Modal States
  const [newModalExercise, setNewModalExercise] = useState({});
  const [editReps, setEditReps] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editSets, setEditSets] = useState("");
  const [editHold, setEditHold] = useState("");
  const [editResistance, setEditResistance] = useState("");
  const [editRest, setEditRest] = useState("");

  const { id } = useParams();
  const currUser = useContext(UserContext).user;

  // For loading data, taken from PatientExerciseMain
  const [loaded, setLoaded] = useState(false);
  const [exerciseType, setExerciseType] = useState([]);
  const [patientName, setPatientName] = useState();

  // For determining if the current page can be modified
  const [canModify, setCanModify] = useState(true);

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
  const [thisMondayStr, setThisMondayStr] = useState();
  const [open, setOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [template, setTemplate] = useState();
  const [modalStyle] = useState(getModalStyle);
  const [selectedEx, setSelectedEx] = useState();

  useEffect(() => {
    const d = new Date();
    let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    const date = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    setThisMondayStr(year + "-" + month + "-" + date);
  }, [currUser]);

  // Get patient name
  useEffect(() => {
    var patientRef = db.collection("patients").doc(id);
    patientRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Patient data:", doc.data());
          setPatientName(doc.data().name);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }, []);

  // Get PT's Exercise Template
  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      const templateRef = db
        .collection("therapists")
        .doc(currUser.uid)
        .collection("templates");
      templateRef.get().then((querySnapshot) => {
        Promise.all(querySnapshot.docs.map((doc) => doc.data())).then(
          (template) => {
            setTemplate(template);
          }
        );
      });
    }
  }, [currUser]);

  const getDayFromNum = (num) => {
    let dayNum;
    switch (num) {
      case "Sunday":
        dayNum = 0;
        break;
      case "Monday":
        dayNum = 1;
        break;
      case "Tuesday":
        dayNum = 2;
        break;
      case "Wednesday":
        dayNum = 3;
        break;
      case "Thursday":
        dayNum = 4;
        break;
      case "Friday":
        dayNum = 5;
        break;
      case "Saturday":
        dayNum = 6;
    }
    return dayNum;
  };
  const getNumFromDay = (num) => {
    let dayNum;
    switch (num) {
      case "Sunday":
        dayNum = 0;
        break;
      case "Monday":
        dayNum = 1;
        break;
      case "Tuesday":
        dayNum = 2;
        break;
      case "Wednesday":
        dayNum = 3;
        break;
      case "Thursday":
        dayNum = 4;
        break;
      case "Friday":
        dayNum = 5;
        break;
      case "Saturday":
        dayNum = 6;
    }
    return dayNum;
  };

  // Handle new patient with no exercisesets collection yet
  useEffect(() => {
    if (Object.entries(currUser).length > 0 && thisMondayStr) {
      var collectionRef = db
        .collection("patients")
        .doc(currUser.uid)
        .collection("exercises")
        .doc("weekEx")
        .collection(thisMondayStr)
        .limit(1);

      collectionRef.get().then((query) => {
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
      let exerciseHolder = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
        exerciseList: [],
      };
      if (thisMondayStr) {
        var patientRef = db
          .collection("patients")
          .doc(id)
          .collection("exercises")
          .doc("weekEx")
          .collection(thisMondayStr);

        // Newly added to load Firestore data
        patientRef.get().then((querySnapshot) => {
          Promise.all(
            querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }))
          ).then((exercises) => {
            exercises.forEach((exercise) => {
              switch (exercise.day) {
                case 0:
                  exerciseHolder["Sunday"].push(exercise);
                  break;
                case 1:
                  exerciseHolder["Monday"].push(exercise);
                  break;
                case 2:
                  exerciseHolder["Tuesday"].push(exercise);
                  break;
                case 3:
                  exerciseHolder["Wednesday"].push(exercise);
                  break;
                case 4:
                  exerciseHolder["Thursday"].push(exercise);
                  break;
                case 5:
                  exerciseHolder["Friday"].push(exercise);
                  break;
                case 6:
                  exerciseHolder["Saturday"].push(exercise);
              }
              if (!exerciseHolder.exerciseList.includes(exercise.name)) {
                exerciseHolder.exerciseList.push(exercise.name);
              }
            });
            setExerciseSets(exerciseHolder);
          });
        });
      }
    };

    fetchPatient();
  }, [thisMondayStr]);

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

  useEffect(() => {
    checkCanModify();
  }, [thisMondayStr]);
  // End loading data

  const checkCanModify = () => {
    // If we are in a week prior to this one, set canModify to false
    // d = this Monday
    const d = new Date();
    let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);

    if (typeof thisMondayStr !== "undefined") {
      // The monday we are looking at
      var currMonday = new Date(thisMondayStr);

      if (currMonday < d) {
        setCanModify(false);
      } else {
        setCanModify(true);
      }
    }
  };

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
      day: getNumFromDay(day),
      name: newEx,
      reps: parseInt(newReps[day]),
      duration: parseFloat(newDuration[day]),
      sets: parseInt(newSets[day]),
      hold: parseInt(newHold[day]),
      resistance: newResistance[day],
      rest: parseInt(newRest[day]),
      videoId: selectedExerciseType[0].videoId,
      complete: false,
      dateAdded: new Date(),
    };
    // var exerciseObjectData = findExercise(newExercise);
    console.log("Adding this exercise to firebase! :)", newExercise);

    // To find the date we are adding the exercise to
    console.log("day", day);
    console.log("index of day", dayToNumIdMap.get(day));

    var n = new Date();
    // Today's index - setDay's index
    console.log("n.getDay()", n.getDay());

    const diff = n.getDay() - dayToNumIdMap.get(day);
    console.log("diff", diff);

    // Diff will be neg. if in the future
    // Can only add exercises to future week
    n = new Date(n.setDate(n.getDate() - diff));
    console.log("n", n);

    return exerciseObjectData;
  };

  // Submit new exercise to firebase
  const addExercise = async (e, setDay, l) => {
    // For debugging purposes - pauses refresh on submit
    e.preventDefault();
    console.log(setDay, l);

    const newExercise = await getUpdatedSet(setDay);
    console.log("newExercise", newExercise);

    const patientRef = db
      .collection("patients")
      .doc(id)
      .collection("exercises")
      .doc("weekEx")
      .collection(thisMondayStr);

    // Add to exercises
    await patientRef
      .add(newExercise)
      .then(function (docRef) {
        console.log("Exercise document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    // Should only reload if previous chunk of code has run..
    window.location.reload(false);
  };

  // Delete exercise from firebase
  const deleteExercise = async (e, setDay, docId) => {
    // For debugging purposes - pauses refresh on submit
    e.preventDefault();

    console.log("Deleting!");
    console.log("docId", docId);
    console.log("Set Day", setDay);
    console.log("id in deleteExercise", id);

    // Now delete exercise document
    var exerciseRef = db
      .collection("patients")
      .doc(id)
      .collection("exercises")
      .doc("weekEx")
      .collection(thisMondayStr)
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

  useEffect((day, exId) => {}, []);

  const editExercise = async (e, exercise) => {
    e.preventDefault();
    console.log("name: ", exercise.name);
    console.log("selectedEx: ", exercise);
    // Need videoId update
    const selectedExerciseType = await exerciseType.filter(
      (ex) => ex.name === exercise.name
    );
    console.log("Exercise VideoId: ", selectedExerciseType[0].videoId);
    const editExObj = {
      day: exercise.day,
      name: exercise.name,
      reps: parseInt(exercise.reps),
      duration: parseFloat(exercise.duration),
      sets: parseInt(exercise.sets),
      hold: parseInt(exercise.hold),
      resistance: exercise.resistance,
      rest: parseInt(exercise.rest),
      videoId: selectedExerciseType[0].videoId,
      complete: false,
      dateAdded: new Date(),
    };

    console.log("Editing!");
    console.log("EditExObj: ", editExObj);
    const exerciseRef = db
      .collection("patients")
      .doc(id)
      .collection("exercises")
      .doc("weekEx")
      .collection(thisMondayStr)
      .doc(exercise.docId);

    // Update
    exerciseRef
      .update(editExObj)
      .then(function (docRef) {
        console.log("Exercise document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      })
      .then(() => {
        window.location.reload(false);
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

  const getStartEnd = (d) => {
    d = new Date(d);
    let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    let sDate = d.getDate();
    let sMonth = d.getMonth() + 1;
    let sYear = d.getFullYear();
    d.setDate(diff + 6);
    let eDate = d.getDate();
    let eMonth = d.getMonth() + 1;
    let eYear = d.getFullYear();
    const startDateStr = sMonth + "/" + sDate + "/" + sYear;
    const endDateStr = eMonth + "/" + eDate + "/" + eYear;
    return startDateStr + " - " + endDateStr;
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
        console.log("Exercises: ", exercises[i]);
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
                  {exercises[i].painLevel ? (
                    <div> Pain Level: {String(exercises[i].painLevel)} </div>
                  ) : null}
                  {exercises[i].note ? (
                    <div> Note: {String(exercises[i].note)} </div>
                  ) : null}
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
      // Go through all exercises for given day and sort by date field
      var sortedExercises = exerciseSets[day].sort(compareDate);
      return sortedExercises;
    };

    const canClick = (day) => {
      console.log("day in canClick", day);

      // Make sure anything has been entered
      if (
        typeof newReps === "undefined" ||
        typeof newDuration === "undefined" ||
        typeof newSets === "undefined" ||
        typeof newHold === "undefined" ||
        typeof newRest === "undefined" ||
        typeof newResistance === "undefined"
      ) {
        return false;
      }

      // Make sure values are entered for proper day
      if (
        typeof newReps[day] === "undefined" ||
        newReps[day] === "" ||
        typeof newDuration[day] === "undefined" ||
        newDuration[day] === "" ||
        typeof newSets[day] === "undefined" ||
        newSets[day] === "" ||
        typeof newHold[day] === "undefined" ||
        newHold[day] === "" ||
        typeof newRest[day] === "undefined" ||
        newRest[day] === "" ||
        typeof newResistance[day] === "undefined" ||
        newResistance[day] === ""
      ) {
        return false;
      } else {
        return true;
      }
    };

    const canClickEdit = (day) => {
      console.log("day in canClickEdit", day);
      console.log("newReps", newReps[day]);
      console.log("newResistance", newResistance[day]);
      console.log("selectedEx", selectedEx);
      // const form = e.currentTarget;
      // return form.checkValidity();

      // Make sure selectedEx contains a value
      if (
        selectedEx.reps === "" ||
        selectedEx.duration === "" ||
        selectedEx.sets === "" ||
        selectedEx.old === "" ||
        selectedEx.rest === "" ||
        selectedEx.resistance === ""
      ) {
        console.log("Missing a value in selectedEx");
        return false;
      }
      return true;
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

    const getPrevWeek = () => {
      console.log("Bringing data of prevWeek ");

      // Retrieve thisMondayStr
      var currMonday = new Date(thisMondayStr);
      console.log("thisMondayStr as a date obj", currMonday);

      // Change it so that it is 7 days in the past.
      var tempDate = currMonday.getDate() - 7;
      currMonday.setDate(tempDate);

      // Log the new currMonday
      console.log("week ago", currMonday);

      // modify thisMondayStr, which will fetch new data
      const date = currMonday.getDate();
      const month = currMonday.getMonth() + 1;
      const year = currMonday.getFullYear();

      console.log("new thisMondayStr", year + "-" + month + "-" + date);
      setThisMondayStr(year + "-" + month + "-" + date);
      // checkCanModify();
    };

    // Very similar code, can condense into one function later
    const getNextWeek = () => {
      console.log("Bringing data of nextWeek");

      console.log("Bringing data of prevWeek ");

      // Retrieve thisMondayStr
      var currMonday = new Date(thisMondayStr);
      console.log("thisMondayStr as a date obj", currMonday);

      // Change it so that it is 7 days in the past.
      var tempDate = currMonday.getDate() + 7;
      currMonday.setDate(tempDate);

      // Log the new currMonday
      console.log("week ago", currMonday);

      // modify thisMondayStr, which will fetch new data
      const date = currMonday.getDate();
      const month = currMonday.getMonth() + 1;
      const year = currMonday.getFullYear();

      console.log("new thisMondayStr", year + "-" + month + "-" + date);
      setThisMondayStr(year + "-" + month + "-" + date);
      // checkCanModify();
    };

    const handleOpen = (e, ex) => {
      e.preventDefault();
      setSelectedEx(ex);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleOpenTemplate = (e) => {
      e.preventDefault();
      setTemplateOpen(true);
    };

    const handleCloseTemplate = (e) => {
      e.preventDefault();
      setTemplateOpen(false);
    };

    return (
      <div>
        <div>
          {/* Modal for Editing */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div style={modalStyle} className={classes.paper}>
              <Typography variant="h4" className={classes.header}>
                Edit this exercise
              </Typography>
              {selectedEx ? (
                <Form
                  noValidate
                  validated={numToDayMap.get(selectedEx.day) == validatedDay}
                  id={`form1-${selectedEx.day}`}
                  // onSubmit={handleSubmit}
                  className={classes.newExercise}
                >
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
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Control
                          as="select"
                          className={classes.exerciseBox}
                          onChange={(event) => {
                            setSelectedEx({
                              ...selectedEx,
                              name: event.target.value,
                            });
                          }}
                        >
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
                          value={selectedEx.reps}
                          onChange={(event) => {
                            setSelectedEx({
                              ...selectedEx,
                              reps: event.target.value,
                            });
                          }}
                          required
                        />
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
                          value={selectedEx.sets}
                          onChange={(event) => {
                            setSelectedEx({
                              ...selectedEx,
                              sets: event.target.value,
                            });
                          }}
                          required
                        />
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
                        value={selectedEx.duration}
                        onChange={(event) => {
                          setSelectedEx({
                            ...selectedEx,
                            duration: event.target.value,
                          });
                        }}
                        required
                      />
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
                          value={selectedEx.hold}
                          onChange={(event) => {
                            setSelectedEx({
                              ...selectedEx,
                              hold: event.target.value,
                            });
                          }}
                          required
                        />
                        {console.log("edit reps??", editReps)}
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
                          value={selectedEx.rest}
                          onChange={(event) => {
                            setSelectedEx({
                              ...selectedEx,
                              rest: event.target.value,
                            });
                          }}
                          required
                        />
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
                          value={selectedEx.resistance}
                          onChange={(event) => {
                            setSelectedEx({
                              ...selectedEx,
                              resistance: event.target.value,
                            });
                          }}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Resistance is required.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col className={classes.centeredCol}>
                      <Button
                        variant="light"
                        type="submit"
                        disabled={!canModify}
                        onClick={(e) => {
                          canClickEdit(numToDayMap.get(selectedEx.day))
                            ? editExercise(e, selectedEx)
                            : doNothing(e, numToDayMap.get(selectedEx.day));
                        }}
                      >
                        Done
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ) : null}
            </div>
          </Modal>

          {/* Modal for Adding Template */}
          <TempModal
            template={template}
            templateOpen={templateOpen}
            handleCloseTemplate={handleCloseTemplate}
          />
          <header className={classes.progressHeader}>
            {patientName ? (
              <Typography variant="h4" className={classes.header}>
                Patient: {patientName}
              </Typography>
            ) : null}
          </header>
          <header className={classes.progressHeader}>
            <Typography variant="h4" className={classes.date}>
              <Button
                variant="light"
                className={classes.arrowButton}
                onClick={() => getPrevWeek()}
              >
                <ArrowBackIosIcon></ArrowBackIosIcon>
              </Button>
              {getStartEnd(thisMondayStr)}
              <Button
                variant="light"
                className={classes.arrowButton}
                onClick={() => getNextWeek()}
              >
                <ArrowForwardIosIcon />
              </Button>
            </Typography>
          </header>
          <header className={classes.progressHeader}>
            <Typography variant="h4" className={classes.header}>
              Progress
            </Typography>
            <Link
              to={{
                pathname: `/PT/patient/history/${id}`,
              }}
              className={classes.link}
            >
              <Button variant="light" className={classes.viewHistory}>
                View History
              </Button>
            </Link>
          </header>

          <div className={classes.progressContainer}>
            <div className={classes.progressDiv}>
              {/* Progress Chart */}
              <Row>
                {Object.entries(exerciseSets).length !== 0 ? (
                  <React.Fragment>
                    <Col>Exercise Name</Col>

                    {exerciseSets.exerciseList.map((ex) => (
                      <Col className={classes.centeredCol}>{ex}</Col>
                    ))}
                  </React.Fragment>
                ) : null}
                {exerciseSets.length === 0 ? (
                  <Col>A new patient - add exercises below!</Col>
                ) : null}
              </Row>
              <Divider />
              {Object.entries(exerciseSets)
                .filter((entry) => entry[0] !== "exerciseList")
                .map((entry, i) => {
                  return (
                    <Row key={i}>
                      <Col>{entry[0]}</Col>
                      {/* Map through each column */}
                      {exerciseSets.exerciseList.map((name, i) => {
                        return (
                          <Col className={classes.centeredCol}>
                            {checkExComplete(entry[1], name)}
                          </Col>
                        );
                      })}
                    </Row>
                  );
                })}
            </div>
          </div>
          {/* End Progress Chart */}

          {/* Description */}
          <div className={classes.descripContainer}>
            {canModify ? (
              <div className={classes.descripDiv}>
                <Typography variant="h4" className={classes.header}>
                  How to Assign Exercises:
                </Typography>
                <li>
                  <span className={classes.emphasis}>Reps: </span>
                  Repetitions of the exercise per set
                </li>
                <li>
                  <span className={classes.emphasis}>Sets: </span> Number of
                  sets to be completed
                </li>
                <li>
                  <span className={classes.emphasis}>Duration (seconds):</span>{" "}
                  Duration of one repetition (including hold time)
                </li>
                <li>
                  <span className={classes.emphasis}>Hold (seconds):</span> Time
                  to hold during each rep? (default of 0)
                </li>
                <li>
                  <span className={classes.emphasis}>Rest (seconds):</span> Rest
                  between sets
                </li>
                <li>
                  <span className={classes.emphasis}>Resistance: </span>
                  Resistance during exercise (i.e. 5kg band)
                </li>
              </div>
            ) : (
              <div>This page is read-only</div>
            )}
          </div>
          {/* End Description */}
          <div className={classes.descripContainer}>
            <Button
              onClick={(e) => {
                handleOpenTemplate(e);
              }}
              variant="dark"
            >
              Add Your Exercise Template
            </Button>
          </div>
          {dotw.map((day, ind) => {
            return (
              <div className={classes.exerciseContainer} key={ind}>
                <div className={classes.exerciseSetDiv} key={ind}>
                  <Typography variant="h4" className={classes.header}>
                    {day} Exercises
                  </Typography>
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

                  {checkMatch(day).map((ex, k) => {
                    return (
                      <div>
                        <Row key={k} className={classes.rows}>
                          <Col>{formatExerciseName(ex.name)}</Col>
                          <Col className={classes.cols}>
                            {ex.reps ? ex.reps : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.sets ? ex.sets : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.duration ? ex.duration : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.hold ? ex.hold : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.rest ? ex.rest : "-"}
                          </Col>
                          <Col className={classes.cols}>
                            {ex.resistance ? ex.resistance : "-"}
                          </Col>
                          <Col className={classes.centeredCol}>
                            {canModify ? (
                              <div className={classes.buttonInline}>
                                <Button
                                  variant="light"
                                  onClick={(e) => {
                                    handleOpen(e, ex);
                                  }}
                                  disabled={!canModify}
                                >
                                  <FontAwesomeIcon
                                    icon={faEdit}
                                    color="#9DB4FF"
                                    size="2x"
                                  />
                                </Button>
                                <Button
                                  variant="light"
                                  onClick={(e) => {
                                    deleteExercise(e, day, ex.docId);
                                  }}
                                  disabled={!canModify}
                                >
                                  <FontAwesomeIcon
                                    icon={faTimes}
                                    color="#9DB4FF"
                                    size="2x"
                                  />
                                </Button>
                              </div>
                            ) : null}
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                  {canModify ? (
                    <Form
                      noValidate
                      validated={!open && day == validatedDay}
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
                              id={`reps-${day}`}
                              onChange={(event) => {
                                let r = newReps;
                                const d = day;
                                r[d] = event.target.value;
                                setNewReps(r);
                              }}
                              required
                            />
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
                              id={`sets-${day}`}
                              onChange={(event) => {
                                let s = newSets;
                                const d = day;
                                s[d] = event.target.value;
                                setNewSets(s);
                              }}
                              required
                            />
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
                              id={`rest-${day}`}
                              onChange={(event) => {
                                let rest = newRest;
                                const d = day;
                                rest[d] = event.target.value;
                                setNewRest(rest);
                              }}
                              required
                            />
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
                              id={`resistance-${day}`}
                              onChange={(event) => {
                                let resistance = newResistance;
                                const d = day;
                                resistance[d] = event.target.value;
                                setNewResistance(resistance);
                              }}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Resistance are required.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col className={classes.centeredCol}>
                          <Button
                            variant="light"
                            type="submit"
                            disabled={!canModify}
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
                  ) : null}
                </div>
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
