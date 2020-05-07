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
import { useHistory } from "react-router-dom";
import { compareSets } from '../DoctorComponents/IndividualPatientView.js';


const useStyles = makeStyles((theme) => ({
  exercises: {
    marginTop: "3%",
    height: "45vh",
    overflowY: "scroll",
  },
  header: {
    marginTop: 10,
    marginBottom: 8,
    color: "#80858a",
  },
  progressHeader: {
    marginTop: 30,
    marginBottom: 8,
    color: "#80858a",
    marginLeft: "9.75%",
  },
  meter: {
    marginTop: 25,
  },
  exerciseContainer: {
    marginTop: 10,
    marginBottom: 40,
    width: "80%",
    margin: "0 auto",
    overflowX: "scroll",
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
  card: {
    maxWidth: 345,
    maxHeight: 430,
  },
  grid: {
    width: "80%",
    margin: "0 auto",
  },
  darkButton: {
    backgroundColor: '#3358C4',
    border: 'none',
    "&:hover": {
      backgroundColor: '#264291',
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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  centerBlock: {
    textAlign: "center",
    height: 30,
    position: 'relative',
  }
  // gradientContainer: {
  //   background: 'linear-gradient(#fff 100%,#f6f6f6 0%)',
  //   height: 50,
  // }
}));

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

const PatientExerciseMain = (props) => {
  const [exerciseSets, setExerciseSets] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [therapistInfo, setTherapistInfo] = useState();
  const [userProfile, setUserProfile] = useState();
  const blankImg = "/img/blankProfile.png";
  const type = localStorage.getItem("type");

  //user id used to load correct user exercises (taken from landing page)
  const currUser = useContext(UserContext).user;
  const history = useHistory();

  const classes = useStyles();

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
        // query => query.size
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
    if (Object.entries(currUser).length > 0) {
      console.log("going");

      // Newly added to load Firestore data
      var patientRef = db
        .collection("patients")
        .doc(currUser.uid)
        .collection("exercisesets");

      // Newly added to load Firestore data
      var fullset = [];
      var l = [];
      patientRef.get().then((querySnapshot) => {
        //used to check whether ExerciseSets should be set
        const exercisesLen = querySnapshot.size;
        querySnapshot.forEach((doc) => {
          const day = doc.data().day;
          var ex = [];
          // Nested inner
          patientRef
            .doc(doc.id)
            .collection("exercises")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc1) => {
                const exercise = doc1.data();
                ex.push(exercise);
                if (!l.includes(exercise.name)) {
                  l.push(exercise.name);
                }
              });
            })
            .then(() => {
              fullset.push({ day: day, exercise: ex, exerciseList: l });

              //when all the days are loaded in, you can set ExerciseSets
              if (fullset.length === exercisesLen) {
                fullset.sort(compareSets);
                setExerciseSets(fullset);
              }
            });
        });
      });
    }
  }, [currUser]);

  useEffect(() => {
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
              <img className={classes.checkIcon} src="/img/complete.png" alt="complete"></img>
            );
          } else {
            return (
              <img className={classes.checkIcon} src="/img/incomplete.png" alt="incomplete"></img>
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
          <div class="container">
            <h1 class="display-4">Hi, {userProfile.name}!</h1>
            {console.log('userprofile', userProfile)}

            {therapistInfo ?
              (<p class="lead">Launch Zoom call with {therapistInfo.name} now</p>) : (
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
                <Button size="small" color="primary" className={classes.darkButton}>
                  Start Zoom Call
                    </Button>
              </a>
            ) : null}
          </div>
        </div>
        {/* End Jumbotron */}



        {/* Progress Chart */}
        <Typography variant="h4" className={classes.progressHeader}>
          This Week's Progress
            </Typography>
        <div className={classes.exerciseContainer}>
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
              <Col>
                You have no exercises yet - please check with your PT!
                  </Col>
            ) : null}
          </Row>
          <Divider />
          {exerciseSets.map((s, i) => {
            return (
              <Row key={i}>
                <Col>{s["day"]}</Col>
                {/* Map through each column */ console.log(s["day"])}
                {s.exerciseList.map((name, j) => {
                  // if s
                  return (
                    <Col className={classes.centeredCol} key={j}>
                      {checkComplete(s.exercise, name)}
                    </Col>
                  );
                })}
              </Row>
            );
          })}
          {/* End Progress Chart */}
        </div>

        <div className={classes.centerBlock}>
          <div className={classes.accentDivider}></div>
        </div>
        {/* <div class="container-fluid" className={classes.gradientContainer}>
        </div> */}

        <div className={classes.exercises}>
          {exerciseSets.map((s, i) => {
            return (
              (s.exercise.length === 0 ? null :
                <div className={classes.exerciseContainer} key={i}>
                  {console.log('my s', s.exercise.length)}
                  <Typography variant="h4" className={classes.header}>
                    {s.day} Exercises ({calculateTotalTime(s)} minutes)
                </Typography>
                  <Row>
                    <Col>Exercise</Col>
                    <Col>Reps</Col>
                    <Col>Duration</Col>
                  </Row>
                  <Divider />
                  {Object.values(s.exercise).map((ex, k) => {
                    return (
                      <div>
                        <Row key={i} className={classes.rows}>
                          <Col>{formatExerciseName(ex.name)}</Col>
                          <Col>{ex.reps}</Col>
                          <Col>{ex.duration}</Col>
                        </Row>
                      </div>
                    );
                  })}
                  <Link
                    to={{
                      pathname: `/workout/${s.day}`,
                      exerciseProps: s,
                      setInd: i,
                    }}
                  >
                    <Button variant="light" className={classes.startButton}>
                      Start
                  </Button>
                  </Link>
                </div>
              )
            );
          })}
        </div>


        {/* <footer className={classes.footer}>
          <img
            src={"/img/StretchGraphic2.png"}
            className={classes.stretchGraphic2}
            alt=""
          />
          <img
            src={"/img/StretchGraphic1.png"}
            className={classes.stretchGraphic1}
            alt=""
          />
          <Typography className={classes.quote}>
            "Movement is a medicine for creating change <br />
            in a person's physical, emotional, and mental states."
            <Typography variant="h6">
              <br />- Carol Welch
            </Typography>
          </Typography>
        </footer> */}
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
