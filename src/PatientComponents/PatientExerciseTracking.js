import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
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
import { Link, useParams, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "../PatientExerciseTracking.css";
import Sidebar from "react-sidebar";
import { Alert, AlertTitle } from "@material-ui/lab";
import { db } from "../Firebase.js";
import { UserContext } from "../contexts/UserContext";
import Drawer from "react-drag-drawer";
import { dayToNumIdMap } from "../DoctorComponents/IndividualPatientView";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  exercises: {
    marginTop: 15,
    minWidth: 250,
  },
  header: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 28,
    },
    display: "inline-block",
    marginTop: 10,
    marginBottom: 8,
    color: "#80858a",
  },
  exerciseName: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
    },
    marginTop: 30,
  },
  video: {
    [theme.breakpoints.down("sm")]: {
      marginTop: "6%",
      minHeight: "45vh",
    },
    minHeight: "65vh",
    width: "70%",
    marginTop: "4%",
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
    marginTop: -20,
  },
  arrows: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: "90%",
      fontSize: 40,
    },
    display: "inline-block",
    marginBottom: "35%",
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
    // position: "absolute",
    textAlign: "center",
    right: "15%",
    left: "15%",
    minHeight: "20vh",
    // bottom: -125,
  },
  time: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
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
  completionAlert: {
    [theme.breakpoints.down("sm")]: {
      marginTop: "4%",
    },
    width: "70%",
    height: "30%",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    margin: "0 auto",
    marginTop: "2%",
  },
  loadingContainer: {
    textAlign: "center",
    paddingTop: "35vh",
  },
  painLevel: {
    width: "100%",
    marginBottom: 20,
  },
  formControl: {
    marginTop: 30,
  },

  modal: {
    outline: "none",
    background: "white",
    fontSize: "1.6rem",
    width: "30rem",
    height: "15rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    zIndex: 15,
    border: "8px",
  },
  submit: {
    marginTop: 30,
  },
  resize: {
    fontSize: 18,
  },
  emphasis: {
    color: "#3358C4",
    fontWeight: 600,
  },
  carouselItem: {
    overflowY: "scroll",
  },
  taskList: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "25%",
      marginTop: "3%"
    },
    marginTop: "2%",
    paddingLeft: "42%",
    textAlign: "left",
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
    margin: "15px 4px",
  },
}));

const getMonday = (d) => {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  d.setDate(diff);
  var date = d.getDate();
  var month = d.getMonth() + 1;
  var year = d.getFullYear();
  const dateDash = year + "-" + month + "-" + date;
  return dateDash;
};

const thisMonday = getMonday(new Date());

const ExerciseCarousel = ({ set, setExerciseDone, exerciseDone }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const classes = useStyles();
  const [drawer, setDrawer] = useState(false);

  const currUser = useContext(UserContext).user;
  const { day } = useParams();
  const history = useHistory();

  useEffect(() => {
    const type = localStorage.getItem("type");
    if (type === "therapists") history.push("/PT");
  }, []);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    setDirection(e.direction);
  };

  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  const handleSubmit = (info, feedback) => {
    // Firestore reference
    var exerciseRef = db
      .collection("patients")
      .doc(info.currUser.uid)
      .collection("exercises")
      .doc("weekEx")
      .collection(thisMonday);
    let ex;
    exerciseRef
      .doc(info.exercise.doc_id)
      .get()
      .then((doc) => {
        console.log(doc.id, " => ", doc.data());
        ex = doc.data();
        exerciseRef.doc(doc.id).update(feedback);
        console.log("ex: ", ex);
        console.log("info: ", info);
        console.log("feedback: ", feedback);
        setDrawer(false);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  const FeedbackPopUp = ({ info }) => {
    const painScale = Array.from({ length: 11 }, (v, k) => k);
    const [feedback, setFeedback] = useState({});

    const setFeedbackField = (field, data) => {
      setFeedback({ ...feedback, [field]: data });
    };

    return (
      <div>
        <Drawer
          open={drawer}
          onRequestClose={toggleDrawer}
          modalElementClass={classes.modal}
        >
          <form
            autoComplete="off"
            onSubmit={() => handleSubmit(info, feedback)}
          >
            <FormControl variant="outlined" className={classes.formControl}>
              <div>
                <InputLabel id="demo-simple-select-outlined-label">
                  Pain Level
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  label="Pain Level"
                  value={feedback.painLevel}
                  onChange={(e) =>
                    setFeedbackField("painLevel", e.target.value)
                  }
                  className={classes.painLevel}
                >
                  {painScale.map((level, i) => (
                    <MenuItem value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </div>
              <div>
                <TextField
                  id="standard-basic"
                  label="Note anomalies"
                  value={feedback.note}
                  onChange={(e) => setFeedbackField("note", e.target.value)}
                  InputProps={{
                    classes: {
                      input: classes.resize,
                    },
                  }}
                />
              </div>
              <Button
                variant="light"
                onClick={() => handleSubmit(info, feedback)}
                className={classes.submit}
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Drawer>
      </div>
    );
  };

  // Update 'complete' flag when timer hits 0
  const updateCompleted = (exercise, currUser) => {
    // Firestore reference
    var exerciseRef = db
      .collection("patients")
      .doc(currUser.uid)
      .collection("exercises")
      .doc("weekEx")
      .collection(thisMonday);

    exerciseRef
      .doc(exercise.doc_id)
      .update({ complete: true })
      .then(() => {
        // alert("Good work!");
        setExerciseDone(true);
        setDrawer(true);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
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
      wrap={false}
    >
      {set.map((exercise) => (
        <Carousel.Item key={exercise.id} className={classes.carouselItem}>
          {/* Success Alert When Exercise is Completed*/}
          {exercise.complete ? (
            <div>
              <Alert severity="success" className={classes.completionAlert}>
                <AlertTitle>Success</AlertTitle>
                Nice! You've completed this exercise.{" "}
                <strong>Keep it up!</strong>
              </Alert>
              <FeedbackPopUp info={{ currUser, exercise }} />
            </div>
          ) : null}
          {/* End Alert */}

          <YouTube videoId={exercise.videoId} className={classes.video} />
          <Typography variant="h5" className={classes.exerciseName}>
            {exercise.name}
          </Typography>
          <div className={classes.timer}>
            {console.log(currUser)}
            {Object.entries(currUser).length > 0 ? (
              <React.Fragment>
                <Timer
                  initialTime={
                    [
                      exercise.sets * exercise.reps * exercise.duration +
                        (exercise.sets - 1) * exercise.rest,
                    ] * 1000
                  }
                  direction="backward"
                  startImmediately={false}
                  checkpoints={[
                    {
                      time: 0,
                      callback: () => {
                        updateCompleted(exercise, currUser);
                      },
                    },
                  ]}
                >
                  {({ start, stop, reset, timerState }) => (
                    <React.Fragment>
                      <div className={classes.time}>
                        <Timer.Minutes />:
                        <Timer.Seconds
                          formatValue={(value) =>
                            `${value < 10 ? `0${value}` : value}`
                          }
                        />
                      </div>
                      <Button
                        onClick={start}
                        variant="outline-primary"
                        className={classes.blueButton}
                      >
                        Start
                      </Button>
                      <Button
                        onClick={stop}
                        variant="outline-primary"
                        className={classes.blueButton}
                      >
                        Stop
                      </Button>
                      <Button
                        onClick={reset}
                        variant="outline-primary"
                        className={classes.blueButton}
                      >
                        Reset
                      </Button>
                    </React.Fragment>
                  )}
                </Timer>
                <Typography variant="h5" className={classes.exerciseName}>
                  Instructions
                </Typography>
                <div className={classes.taskList}>
                  <li>
                    <span className={classes.emphasis}>Reps:</span>{" "}
                    {exercise.reps}
                  </li>
                  <li>
                    <span className={classes.emphasis}>Sets:</span>{" "}
                    {exercise.sets}
                  </li>
                  <li>
                    <span className={classes.emphasis}>
                      Duration (seconds):
                    </span>{" "}
                    {exercise.duration}
                  </li>
                  <li>
                    <span className={classes.emphasis}>
                      Hold during rep (seconds):
                    </span>{" "}
                    {exercise.hold}
                  </li>
                  <li>
                    <span className={classes.emphasis}>Rest (seconds):</span>{" "}
                    {exercise.rest}
                  </li>
                  <li>
                    <span className={classes.emphasis}>Resistance:</span>{" "}
                    {exercise.resistance}
                  </li>
                </div>
              </React.Fragment>
            ) : // End Task Stuff
            null}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

//to get
const numToDayMap = new Map([
  [0, "Sunday"],
  [1, "Monday"],
  [2, "Tuesday"],
  [3, "Wednesday"],
  [4, "Thursday"],
  [5, "Friday"],
  [6, "Saturday"],
]);

// Main function
const ExerciseTracking = (props) => {
  const [currentSet, setCurrentSet] = useState([]);
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [checked, setChecked] = useState([]);
  const [progress, setProgress] = useState(0);
  const [exerciseDone, setExerciseDone] = useState({});

  // Added
  const currUser = useContext(UserContext).user;
  console.log("Current User from Main", currUser);
  console.log("currentSet", currentSet);

  // Added
  const location = useLocation();
  const { day } = useParams();

  // Use docID to retreive a specific patient's data from Firestore
  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      // Newly added to load Firestore data
      console.log(location.patientInfo);
      var setRef = db
        .collection("patients")
        .doc(currUser.uid)
        .collection("exercises")
        .doc("weekEx")
        .collection(thisMonday);

      console.log("setRef", setRef);
      // Newly added to load Firestore data, using onSnapshot to get live updates

      setRef.onSnapshot(function (querySnapshot) {
        var l = [];
        querySnapshot.forEach(function (doc) {
          console.log("Got data again via snapshot", doc.data());
          if (numToDayMap.get(doc.data().day) == day) {
            l.push({ doc_id: doc.id, ...doc.data() });
          }
        });
        setCurrentSet(l);
      });
    }
  }, [currUser, exerciseDone]);

  // Make sure set and user are both non-empty before loading page
  useEffect(() => {
    if (currentSet.length !== 0) {
      console.log("currentSet length", currentSet.length);
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
      <div className={classes.exerciseContainer}>
        <Typography variant="h4" className={classes.header}>
          {day}'s Exercises
        </Typography>
        <Divider />
        {console.log("set in RET", currentSet)}
        <ExerciseCarousel
          set={currentSet}
          exerciseDone={exerciseDone}
          setExerciseDone={setExerciseDone}
        />
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  };

  return <div>{loaded ? renderExerciseTracking() : renderLoading()}</div>;
};

export default ExerciseTracking;
