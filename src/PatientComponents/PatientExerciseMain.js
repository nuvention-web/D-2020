import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Typography, Container } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { db } from "../Firebase.js";
import { UserContext } from "../contexts/UserContext";

const useStyles = makeStyles((theme) => ({
  exercises: {
    marginTop: "6%",
    height: "55%",
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
    marginTop: 60,
    marginLeft: 120,
    height: 250,
    width: 460,
  },
  exerciseContainer: {
    marginTop: 30,
    marginBottom: 40,
    width: "80%",
    margin: "0 auto",
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
    textAlign: "center"
  }
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
  const [percentFinished, setPercentFinished] = useState(0);
  const [loaded, setLoaded] = useState(false);

  //user id used to load correct user exercises (taken from landing page)
  const currUser = useContext(UserContext).user;
  const classes = useStyles();

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
        // For each set
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
              console.log("fullset", JSON.stringify(fullset));
              setExerciseSets(fullset);
            });
        });
      });
    }
  }, [currUser]);

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
            return <img className={classes.checkIcon} src="/img/complete.png"></img>
          }
          else {
            return <img className={classes.checkIcon} src="/img/incomplete.png"></img>
          }
        }
      }
      return "-";
    };

    return (
      <div className={classes.window}>
          {/* Progress Chart */}
          <div className={classes.exerciseContainer}>
          <Typography variant="h4" className={classes.header}>
            Your Progress
          </Typography>
          <Row>
            <Col>Exercise Name</Col>
            {exerciseSets
              ? exerciseSets[0].exerciseList.map((ex) => <Col className={classes.centeredCol}>{ex}</Col>)
              : null}
          </Row>
          <Divider />

          {exerciseSets.map((s, i) => {
            return (
              <Row key={i}>
                <Col>{s["day"]}</Col>
                {/* Map through each column */}
                {s.exerciseList.map((name, i) => {
                  // if s
                  return (
                    <Col className={classes.centeredCol}> 
                      {checkComplete(s.exercise, name)}
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </div>
        {/* End Progress Chart */}

        <div className={classes.exercises}>
          {exerciseSets.map((s, i) => {
            return (
              <div className={classes.exerciseContainer} key={i}>
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
                      <Row key={i}>
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
            );
          })}
        </div>

        <footer className={classes.footer}>
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
        </footer>
      </div>
    );
  };

  const renderTable = () => {
    return <div className={classes.window}>{renderItems()}</div>;
  };

  const renderLoading = () => {
    return <h1>Loading...</h1>;
  };

  return (
    <div className={classes.window}>
      {loaded ? renderTable() : renderLoading()}
    </div>
  );
};

export default PatientExerciseMain;
