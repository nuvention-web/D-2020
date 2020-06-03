import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  AppBar,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "react-bootstrap/Button";
import PatientExerciseData from "../ModelJSON/PatientExercises.json";
import { db } from "../Firebase.js";
import Patient from "../PatientComponents/Patient";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "#80858a",
  },
  appBar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    height: 100,
    display: "inline-block",
  },
  tendonLogo: {
    width: 150,
    float: "left",
    display: "inline-block",
    margin: "40px 30px",
  },
  exercises: {
    marginTop: 15,
    minWidth: 250,
  },
  header: {
    marginTop: "2.0rem",
    marginBottom: 8,
    color: "#80858a",
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
  blueButton: {
    backgroundColor: "#3358C4",
    color: "white",
    border: "none",
    height: "calc(1.5em + .75rem + 2px)",
    "&:hover": {
      color: "white",
      backgroundColor: "#9DB4FF",
    },
  },
  patientInfoCard: {
    width: 300,
    minHeight: 430,
    marginRight: 40,
    marginTop: 10,
  },
  accentDivider: {
    content: "",
    display: "block",
    width: "6.25rem",
    height: ".325rem",
    marginTop: "1.5rem",
    background: "#9DB4FF",
    marginBottom: "2.5rem",
  },
  yourExercises: {
    marginTop: "8.5rem",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "40vh",
  },
}));

const DoctorView = ({ setHaveLoggedIn }) => {
  const classes = useStyles();
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState([]);
  const patientData = PatientExerciseData;
  const [loaded, setLoaded] = useState(false);
  const currUser = useContext(UserContext).user;
  const [therapistInfo, setTherapistInfo] = useState({});
  const type = localStorage.getItem("type");
  const history = useHistory();

  // Load correct NavBar for PT
  useEffect(() => {
    if (type !== "") {
      setHaveLoggedIn(true);
      if (type === "patients") history.push("/workout");
    }
  }, [type]);

  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      let p = [];
      // get patient of the therapist
      db.collection("therapists")
        .doc(currUser.uid)
        .get()
        .then((doc) => {
          let therapist = doc.data();
          setTherapistInfo(therapist);
        });
    }
  }, [currUser]);

  useEffect(() => {
    // Figure out the patient of the therapist
    if (Object.entries(currUser).length > 0) {
      let p = [];
      // get patient of the therapist
      db.collection("therapists")
        .doc(currUser.uid)
        .get()
        .then((doc) => {
          let therapist = doc.data();
          console.log(therapist);
          //load patient ids if PT has patients
          if (therapist.patients) {
            therapist.patients.forEach((patient) => p.push(patient));
            setPatientId(p);
          }

          //handles case if PT has no patients
          else {
            setPatients(["noPatients"]);
          }
        });
    }
  }, [currUser]);

  useEffect(() => {
    // Get connected patients if PT has any
    if (patientId.length !== 0) {
      // Get actual connected patients
      let returnPat = [];
      patientId.forEach((pId) => {
        db.collection("patients")
          .doc(pId)
          .get()
          .then((doc) => {
            let individual = doc.data();
            console.log("Individual", individual);
            individual.uid = pId;
            returnPat.push(individual);
          })
          .then(() => {
            // When everything's fully loaded
            if (patientId.length === returnPat.length) {
              console.log("This is returnPat: ", returnPat);
              setPatients(returnPat);
            }
          });
      });
    }
  }, [patientId]);

  useEffect(() => {
    if (patients.length !== 0) {
      setLoaded(true);
    }
  }, [patients]);

  const renderItems = () => {
    if (patients[0] !== "noPatients") {
      return (
        <div>
          <Container fixed>
            <Typography variant="h3" className={classes.header}>
              Your Patients
            </Typography>
            <div className={classes.accentDivider}></div>
            <Grid container direction="row">
              {patients.map((p, i) => {
                return (
                  <Grid item className={classes.patientInfoCard} key={i}>
                    <Patient p={p} therapist={therapistInfo} />
                  </Grid>
                );
              })}
            </Grid>
            <div className={classes.yourExercises}>
              <Typography variant="h3" className={classes.header}>
                Your Exercises
              </Typography>
              <div className={classes.accentDivider}></div>
              <Link to="/PT/exercises" className={classes.link}>
                <Button
                  className={classes.blueButton}
                  variant="outline-primary"
                >
                  View Exercises
                </Button>
              </Link>
            </div>
          </Container>
        </div>
      );
    } else if (patients[0] === "noPatients") {
      return (
        <div className={classes.root}>
          <Container fixed>
            {/* <Link to="/" className={classes.link}>
              <Button className={classes.blueButton} variant="outline-primary">
                Back
              </Button>
            </Link> */}
            <Typography variant="h3" className={classes.header}>
              Your Patients
            </Typography>
            <div className={classes.accentDivider}></div>
            <Typography variant="h4">
              You don't have any patients connected with you yet
            </Typography>
            <div className={classes.yourExercises}>
              <Typography variant="h3" className={classes.header}>
                Your Exercises
              </Typography>
              <div className={classes.accentDivider}></div>
              <Link to="/PT/exercises" className={classes.link}>
                <Button
                  className={classes.blueButton}
                  variant="outline-primary"
                >
                  View Exercises
                </Button>
              </Link>
            </div>
          </Container>
        </div>
      );
    }
  };

  const renderTable = () => {
    return <div>{renderItems()}</div>;
  };

  const renderLoading = () => {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  };

  return <div>{loaded ? renderTable() : renderLoading()}</div>;
};

export default DoctorView;
