import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Grid, AppBar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "react-bootstrap/Button";
import PatientExerciseData from "../ModelJSON/PatientExercises.json";
import { db } from "../Firebase.js";
import Patient from "../PatientComponents/Patient";
import { UserContext } from "../contexts/UserContext";

const useStyles = makeStyles((theme) => ({
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
    marginTop: 10,
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
    backgroundColor: "#9DB4FF",
    color: "white",
    border: "none",
    height: "calc(1.5em + .75rem + 2px)",
    "&:hover": {
      color: "white",
      backgroundColor: "#3358C4",
    },
  },
  patientInfoCard: {
    width: 300,
    minHeight: 430,
    margin: 10,
  },
  accentDivider: {
    content: "",
    display: "block",
    width: "6.25rem",
    height: ".325rem",
    marginTop: "1.5rem",
    background: "#9DB4FF",
  },
}));

const DoctorView = () => {
  const classes = useStyles();
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState([]);
  const patientData = PatientExerciseData;
  const [loaded, setLoaded] = useState(false);
  const currUser = useContext(UserContext).user;

  useEffect(() => {
    // Figure out the
    if (Object.entries(currUser).length > 0) {
      let p = [];
      // get patient of the therapist
      db.collection("therapists")
        .doc(currUser.uid)
        .get()
        .then(async (doc) => {
          let therapist = doc.data();
          console.log(therapist);
          therapist.patients.forEach((patient) => p.push(patient));
          console.log(p);
          setPatientId(p);
        });
    }
  }, [currUser]);

  useEffect(() => {
    // Get actual connected patients
    let returnPat = [];
    patientId.forEach((patient) => {
      db.collection("patients")
        .doc(patient)
        .get()
        .then((doc) => {
          let individual = doc.data();
          console.log(individual);
          returnPat.push(individual);
        })
        .then(() => setPatients(returnPat));
    });
  }, [patientId]);

  useEffect(() => {
    if (patients.length != 0) {
      setLoaded(true);
    }
  }, [patients]);

  const renderItems = () => {
    return (
      <div>
        <Container fixed>
          <Link to="/" className={classes.link}>
            <Button className={classes.blueButton} variant="outline-primary">
              Back
            </Button>
          </Link>
          <Typography variant="h4" className={classes.header}>
            Your Patients
          </Typography>
          <div className={classes.accentDivider}></div>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={1}
          >
            {patients.map((p, i) => {
              return (
                <Link
                  to={{
                    pathname: "/PT/patient",
                    patientProps: { patientInfo: p },
                  }}
                  className={classes.link}
                >
                  <div>
                    <Grid item className={classes.patientInfoCard} key={i}>
                      <Patient name={p.name} photo={p.img} bio={p.bio} />
                    </Grid>
                  </div>
                </Link>
              );
            })}
          </Grid>
        </Container>
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

export default DoctorView;
