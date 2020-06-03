import React, { useState, useEffect, useContext } from "react";
import Exercise from "./Exercise";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Grid, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { db } from "../../Firebase";
import { UserContext } from "../../contexts/UserContext";
import Template from "./Template";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  exercises: {
    marginTop: 15,
    minWidth: 250,
  },
  header: {
    marginTop: 10,
    marginBottom: 8,
    color: "#80858a",
    display: "inline",
    marginRight: 50,
  },
  meter: {
    marginTop: 25,
  },
  video: {
    marginTop: 30,
    marginLeft: 120,
    height: 250,
    width: 460,
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
  stretchGraphic: {
    height: 225,
    marginLeft: 15,
    marginTop: 55,
  },
  exerciseBox: {
    height: "150vh",
  },
  exButton: {
    backgroundColor: "#3358C4",
    color: "white",
    border: "none",
    height: "calc(1.5em + .75rem + 2px)",
    "&:hover": {
      color: "white",
      backgroundColor: "#9DB4FF",
    },
    marginBottom: 100,
  },
  tempButton: {
    backgroundColor: "#3358C4",
    color: "white",
    border: "none",
    height: "calc(1.5em + .75rem + 2px)",
    "&:hover": {
      color: "white",
      backgroundColor: "#9DB4FF",
    },
    marginBottom: 100,
  },
  accentDivider: {
    content: "",
    display: "block",
    width: "8.25rem",
    height: ".325rem",
    marginTop: "1.5rem",
    background: "#9DB4FF",
  },
  checkIcon: {
    maxWidth: 35,
  },
  inputBox: {
    width: 50,
    height: "calc(1.5em + .75rem + 2px)",
    borderRadius: 5,
    border: "1px solid #ccc",
  },

  centeredCol: {
    textAlign: "center",
  },

  exercisesGrid: {
    marginTop: 15,
    marginRight: 15,
    display: "flex",
    flexWrap: "wrap",
  },

  exerciseGridContainer: {
    marginTop: 40,
    marginBottom: "4%",
  },

  // paper: {
  //   padding: theme.spacing(2),
  //   textAlign: "center",
  //   color: theme.palette.text.secondary,
  // },
  // // End for grid
}));

const Exercises = () => {
  const classes = useStyles();
  const currUser = useContext(UserContext).user;
  const [exercises, setExercises] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [deleted, setDeleted] = useState();
  const history = useHistory();

  useEffect(() => {
    const type = localStorage.getItem("type");
    if (type && type === "patients") history.push("/workout");
  }, []);

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
          setExercises(exerciseArr);
        });
    }
  }, [currUser, deleted]);

  //fetch template data
  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      const templateArr = [];
      db.collection("therapists")
        .doc(currUser.uid)
        .collection("templates")
        .get()
        .then((querySnapshot) => {
          console.log(querySnapshot);
          querySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            templateArr.push({ ...data, id });
          });
        })
        .then(() => {
          setTemplates(templateArr);
        });
    }
  }, [currUser, deleted]);

  return (
    <div>
      <Container>
        <Typography variant="h3" className={classes.header}>
          Your Exercises
        </Typography>

        <div className={classes.accentDivider}></div>
        <Grid
          container
          direction="row"
          className={classes.exerciseGridContainer}
        >
          {exercises && currUser
            ? exercises.map((e, i) => {
                return (
                  <div>
                    <Grid item key={i} className={classes.exercisesGrid}>
                      <Exercise
                        exercise={e}
                        currUser={currUser}
                        setDeleted={setDeleted}
                      />
                    </Grid>
                  </div>
                );
              })
            : null}
        </Grid>
        <Link
          to={{
            pathname: "/PT/exercises/new",
          }}
          className={classes.link}
        >
          {" "}
          <Button className={classes.exButton} variant="outline-primary">
            new exercise
          </Button>
        </Link>
        <br />

        <Typography variant="h3" className={classes.header}>
          Your Templates
        </Typography>
        <div className={classes.accentDivider}></div>
        <Grid
          container
          direction="row"
          className={classes.exerciseGridContainer}
        >
          {templates && currUser
            ? templates.map((t, i) => {
                return (
                  <div>
                    <Grid item key={i} className={classes.exercisesGrid}>
                      <Template
                        template={t}
                        currUser={currUser}
                        setDeleted={setDeleted}
                      />
                    </Grid>
                  </div>
                );
              })
            : null}
        </Grid>
        <Link
          to={{
            pathname: "/PT/exercises/templates",
          }}
          className={classes.link}
        >
          {" "}
          <Button className={classes.tempButton} variant="outline-primary">
            new template
          </Button>
        </Link>
      </Container>
    </div>
  );
};

export default Exercises;
