import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, TextField } from "@material-ui/core";
import { UserContext } from "../../contexts/UserContext";
import { db } from "../../Firebase";
import { Button } from "react-bootstrap";

const ExerciseEdit = () => {
  const useStyles = makeStyles((theme) => ({
    root: {
      color: "#80858a",
      marginLeft: "3.5%",
    },
    form: {
      textAlign: "left",
      marginTop: "3%",
      "& > *": {
        marginTop: theme.spacing(5),
        width: "25ch",
      },
    },
    image: {
      width: "25%",
      height: "25%",
    },
    profileType: {
      width: "150%",
      fontSize: 18,
    },
    addPhoto: {
      marginBottom: "-1.5%",
    },
    bio: {
      width: "130%",
    },
    purpleDivider: {
      backgroundColor: "#9DB4FF",
      height: ".225rem",
      width: "6.75rem",
    },
    blueDivider: {
      backgroundColor: "#3358C4",
      height: ".225rem",
      width: "17.00rem",
    },
    dividers: {
      display: "flex",
      flexDirection: "row",
      marginTop: 10,
    },
    nameField: {
      width: "130%",
    },
    codeField: {
      width: "130%",
    },
    resize: {
      fontSize: 18,
    },
  }));

  const { id } = useParams();
  const history = useHistory();
  const youtubeUrlPrefix = "https://www.youtube.com/watch?v=";
  const [exercise, setExercise] = useState();
  const currUser = useContext(UserContext).user;
  const classes = useStyles();


  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    stretched: "",
    url: "",
  });
  const setExerciseField = (field, data) => {
    setExerciseForm({ ...exerciseForm, [field]: data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let parsedUrl = "";
    let { name, stretched, url } = exerciseForm;
    if (name === "") name = exercise.name;
    if (stretched === "") stretched = exercise.stretched;

    if (url === "") {
      parsedUrl = exercise.videoId;
    } else parsedUrl = videoIdParser(url);

    console.log(name, stretched, parsedUrl);

    db.collection("therapists")
      .doc(currUser.uid)
      .collection("exercises")
      .doc(id)
      .update({
        name: name,
        stretched: stretched,
        videoId: parsedUrl,
      })
      .then(function () {
        console.log("Document successfully written!");
        history.push("/PT/exercises");
      })
      .catch(function (error) {
        console.error("Error: updating document: ", error);
      });
    // Add the new exercises to the DB
    /// Place to start
  };

  const videoIdParser = (url) => {
    let video_id = url.split("v=")[1];
    const ampersandPosition = video_id.indexOf("&");
    if (ampersandPosition != -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    console.log("Video Id: ", video_id);
    return video_id;
  };

  useEffect(() => {
    if (Object.entries(currUser).length > 0) {
      const exerciseArr = [];
      db.collection("therapists")
        .doc(currUser.uid)
        .collection("exercises")
        .doc(id)
        .get()
        .then((querySnapshot) => {
          setExercise(querySnapshot.data());
        });
    }
  }, [currUser, id]);

  return (
    <div className={classes.root}>
      {exercise ? (
        <div>
          <Typography variant="h3">Edit Your Exercise</Typography>
          <div className={classes.dividers}>
            <div className={classes.purpleDivider}></div>
            <div className={classes.blueDivider}></div>
          </div>
          <form
            className={classes.form}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div>
              <TextField
                id="standard-basic"
                label="Name"
                value={
                  exerciseForm.name !== "" ? exerciseForm.name : exercise.name
                }
                onChange={(e) => setExerciseField("name", e.target.value)}
                className={classes.nameField}
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
              />
            </div>
            <div>
              <TextField
                id="standard-basic"
                label="Primary muscle that should be stretched"
                value={
                  exerciseForm.stretched !== ""
                    ? exerciseForm.stretched
                    : exercise.stretched
                }
                onChange={(e) => setExerciseField("stretched", e.target.value)}
                className={classes.nameField}
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
              />
            </div>
            <div>
              <TextField
                id="standard-basic"
                label="Youtube Video URL of the exercise"
                value={
                  exerciseForm.url !== ""
                    ? exerciseForm.url
                    : youtubeUrlPrefix + exercise.videoId
                }
                onChange={(e) => setExerciseField("url", e.target.value)}
                className={classes.nameField}
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
              />
            </div>
            <br />
            <Button variant="light" type="submit">
              Submit
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default ExerciseEdit;
