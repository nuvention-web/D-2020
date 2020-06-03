import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Typography,
  Container,
  CircularProgress,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { db } from "../Firebase.js";
import { UserContext } from "../contexts/UserContext";
import { compareSets } from "../DoctorComponents/IndividualPatientView.js";
import { useLocation, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  exercises: {
    [theme.breakpoints.down("sm")]: {
      overflowX: "scroll",
    },
    marginTop: "3%",
    height: "45vh",
    overflowY: "scroll",
  },
  header: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    },
    marginTop: 10,
    marginBottom: 8,
    color: "#80858a",
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
  meter: {
    marginTop: 25,
  },
  jumbotronContainer: {
    marginTop: 15,
    marginBottom: 40,
    width: "80%",
    margin: "0 auto",
  },
  progressContainer: {
    // when screen is small
    [theme.breakpoints.down("xs")]: {
      overflowX: "scroll",
    },
    marginTop: 15,
    marginBottom: 40,
    width: "80%",
    margin: "0 auto",
  },
  progressDiv: {
    minWidth: "600px",
  },
  exerciseContainer: {
    // when screen is small
    [theme.breakpoints.down("xs")]: {
      overflowX: "scroll",
    },
    marginTop: 20,
    marginBottom: 40,
    width: "80%",
    margin: "0 auto",
  },
  exerciseSetDiv: {
    minWidth: "700px",
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
  checkIcon: {
    maxWidth: 35,
  },
  loadingContainer: {
    textAlign: "center",
    paddingTop: "30vh",
  },
  rows: {
    marginTop: 10,
    minwidth: "900px",
  },
  card: {
    maxWidth: 345,
    maxHeight: 430,
  },
  grid: {
    width: "80%",
    margin: "0 auto",
  },
  darkButton: {
    backgroundColor: "#3358C4",
    border: "none",
    "&:hover": {
      backgroundColor: "#264291",
    },
  },
  accentDivider: {
    content: "",
    display: "block",
    width: "6.25rem",
    height: ".325rem",
    marginTop: "1.5rem",
    background: "#9DB4FF",
    marginBottom: "3rem",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  centerBlock: {
    textAlign: "center",
    height: 30,
    position: "relative",
  },
  cols: {
    textAlign: "center",
    minWidth: "85px",
  },
  firstCol: {
    minWidth: "200px",
  },
  timeIcon: {
    width: 20,
    marginRight: 5,
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
}));

const calculateTotalTime = (exercises) => {
  var t = 0;
  for (const [i, entry] of Object.entries(exercises)) {
    // t += entry.duration;
    t +=
      entry.sets * entry.reps * entry.duration + (entry.sets - 1) * entry.rest;
  }
  // Minutes and seconds
  var m = Math.floor(t / 60);
  var s = t % 60;
  return m.toString() + " min " + s.toString() + " seconds";
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

// export const getMonday = (d) => {
//     d = new Date(d);
//     var day = d.getDay(),
//       diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
//     d.setDate(diff);
//     var date = d.getDate();
//     var month = d.getMonth() + 1;
//     var year = d.getFullYear();
//     const dateSlash = month + "/" + date + "/" + year;
//     const dateDash = year + "-" + month + "-" + date;
//     return [dateSlash, dateDash];
//   };

const PatientExerciseMain = ({ setHaveLoggedIn }) => {
  const [exerciseSets, setExerciseSets] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [therapistInfo, setTherapistInfo] = useState();
  const [userProfile, setUserProfile] = useState();

  const blankImg = "/img/blankProfile.png";
  const type = localStorage.getItem("type");
  console.log("TYpe: ", type);
  //user id used to load correct user exercises (taken from landing page)
  const currUser = useContext(UserContext).user;
  const history = useHistory();

  const classes = useStyles();

  const getMonday = (d) => {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    const dateSlash = month + "/" + date + "/" + year;
    const dateDash = year + "-" + month + "-" + date;
    return [dateSlash, dateDash];
  };
  const weekBeginning = getMonday(new Date())[0];

  const thisMondayStr = getMonday(new Date())[1];

  // Load correct NavBar for patient
  useEffect(() => {
    if (type !== "") {
      setHaveLoggedIn(true);
      if (type === "therapists") history.push("/PT");
    }
  }, [type]);

  useEffect(() => {
    if (Object.entries(currUser).length > 0 && thisMondayStr) {
      console.log("this runs");
      var collectionRef = db
        .collection("patients")
        .doc(currUser.uid)
        .collection("exercises")
        .doc("weekEx")
        .collection(thisMondayStr)
        .limit(1);

      collectionRef.get().then((query) => {
        console.log("query size:", query.size);
        if (query.size === 0) {
          setLoaded(true);
        }
      });
    }
  }, [currUser]);

  // Get zoom link of the therapist
  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      db.collection("patients")
        .doc(currUser.uid)
        .get()
        .then((snap) => {
          const patient = snap.data();
          if (patient.code) {
            db.collection("therapists")
              .doc(patient.code)
              .get()
              .then((th) => {
                const therapist = th.data();
                setTherapistInfo(therapist);
              });
          }
        });
    }
  }, [currUser]);

  // note: need to load data asynchronously first
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
      if (Object.entries(currUser).length > 0 && thisMondayStr) {
        console.log("This Monday: ", thisMondayStr);
        console.log("id", currUser.uid);

        var patientRef = db
          .collection("patients")
          .doc(currUser.uid)
          .collection("exercises")
          .doc("weekEx")
          .collection(thisMondayStr);

        // Newly added to load Firestore data
        patientRef.get().then((querySnapshot) => {
          console.log("QuerySnapshot: ", querySnapshot.docs);
          Promise.all(
            querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }))
          ).then((exercises) => {
            console.log("Exercises: ", exercises);
            exercises.forEach((exercise) => {
              console.log("Exercise: ", exercise);
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
                console.log("l now", exerciseHolder.exerciseList);
              }
            });
            console.log("exerciseHolder: ", exerciseHolder);
            setExerciseSets(exerciseHolder);
          });
        });
      }
    };

    fetchPatient();
  }, [currUser]);

  useEffect(() => {
    console.log(type, currUser);
    if (Object.entries(currUser).length > 0 && type) {
      db.collection(type)
        .doc(currUser.uid)
        .get()
        .then(function (doc) {
          setUserProfile(doc.data());
        });
    }
  }, [currUser, type]);

  useEffect(() => {
    if (exerciseSets.length !== 0) {
      setLoaded(true);
    }
  }, [exerciseSets]);

  const renderItems = () => {
    // Return true, false, or - (not an exercise for this day)
    const checkComplete = (exercises, exname) => {
      // Iterate through set for the day
      for (let i = 0; i < exercises.length; i++) {
        if (exercises[i].name === exname) {
          // Return bool
          if (exercises[i].complete) {
            return (
              <img
                className={classes.checkIcon}
                src="/img/complete.png"
                alt="complete"
              ></img>
            );
          } else {
            return (
              <img
                className={classes.checkIcon}
                src="/img/incomplete.png"
                alt="incomplete"
              ></img>
            );
          }
        }
      }
      return "-";
    };

    return (
      <div className={classes.window}>
        {/* Start Jumbotron */}
        <div class="jumbotron jumbotron-fluid">
          <div className={classes.jumbotronContainer}>
            {userProfile ? (
              <h1 class="display-4">Hi, {userProfile.name}!</h1>
            ) : null}
            {therapistInfo ? (
              <p class="lead">
                Start online meeting with {therapistInfo.name} now
              </p>
            ) : (
              <div>
                <Button
                  variant="light"
                  onClick={() =>
                    history.push({
                      pathname: "/profile/edit",
                      userProfile: userProfile,
                    })
                  }
                  className={classes.editButton}
                >
                  Connect with your therapist!
                </Button>
              </div>
            )}

            {therapistInfo && therapistInfo.zoom ? (
              <a href={`${therapistInfo.zoom}`} target="_blank">
                <Button
                  size="small"
                  color="primary"
                  className={classes.darkButton}
                >
                  Start Zoom Call
                </Button>
              </a>
            ) : null}
          </div>
        </div>
        {/* End Jumbotron */}

        {/* Progress Chart */}
        <header className={classes.progressHeader}>
          <Typography variant="h4" className={classes.progressHeader}>
            Week of {weekBeginning} Progress
          </Typography>
          <Link
            to={{
              pathname: `/PT/patient/history/${currUser.uid}`,
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
            <Row>
              {Object.entries(exerciseSets).length !== 0 ? (
                <React.Fragment>
                  <Col>Exercise Name</Col>
                  {exerciseSets.exerciseList.map((ex) => (
                    <Col class="col-4" className={classes.cols}>
                      {ex}
                    </Col>
                  ))}
                </React.Fragment>
              ) : null}
              {exerciseSets.length === 0 ? (
                <Col>
                  You have no exercises yet - please check with your PT!
                </Col>
              ) : null}
            </Row>
            <Divider />
            {Object.entries(exerciseSets)
              .filter((s) => s[0] !== "exerciseList")
              .map((s, i) => {
                return (
                  <Row key={i}>
                    <Col>{s[0]}</Col>
                    {exerciseSets.exerciseList.map((name, j) => {
                      // if s
                      return (
                        <Col className={classes.cols} key={j}>
                          {checkComplete(s[1], name)}
                        </Col>
                      );
                    })}
                  </Row>
                );
              })}
          </div>
          {/* End Progress Chart */}
        </div>

        <div className={classes.centerBlock}>
          <div className={classes.accentDivider}></div>
        </div>

        <div className={classes.exercises}>
          {Object.entries(exerciseSets)
            .filter((s) => s[0] !== "exerciseList")
            .map((s, i) => {
              console.log("exercises", s[1]);
              return s[1].length === 0 ? null : (
                <div className={classes.exerciseContainer} key={i}>
                  <div className={classes.exerciseSetDiv} key={i}>
                    <Typography variant="h4" className={classes.header}>
                      {s[0]}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      display="block"
                      gutterBottom
                    >
                      <i class="far fa-clock"></i>
                      <img
                        src={"/img/timeicon.png"}
                        className={classes.timeIcon}
                        alt="timeicon"
                      />
                      {calculateTotalTime(s[1])}
                    </Typography>
                    <Row className={classes.rows}>
                      <Col className={classes.firstCol}>Exercise</Col>
                      <Col className={classes.cols}>Reps</Col>
                      <Col className={classes.cols}>Duration (s)</Col>
                      <Col className={classes.cols}>Sets</Col>
                      <Col className={classes.cols}>Hold (s)</Col>
                      <Col className={classes.cols}>Resistance</Col>
                      <Col className={classes.cols}>Rest (s)</Col>
                    </Row>
                    <Divider />
                    {s[1].map((ex, k) => {
                      return (
                        <div>
                          <Row key={i} className={classes.rows}>
                            <Col className={classes.firstCol}>
                              {ex.name ? ex.name : "-"}
                            </Col>
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
                          </Row>
                        </div>
                      );
                    })}
                    <Link
                      to={{
                        pathname: `/workout/${s[0]}`,
                        exerciseProps: s,
                        setInd: i,
                      }}
                    >
                      <Button variant="light" className={classes.startButton}>
                        Start
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const renderTable = () => {
    return <div className={classes.window}>{renderItems()}</div>;
  };

  const renderLoading = () => {
    return (
      <Container className={classes.loadingContainer}>
        <CircularProgress />
      </Container>
    );
  };

  return (
    <div className={classes.window}>
      {loaded ? renderTable() : renderLoading()}
    </div>
  );
};

export default PatientExerciseMain;
