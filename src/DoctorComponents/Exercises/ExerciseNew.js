import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, TextField } from "@material-ui/core";
import { UserContext } from "../../contexts/UserContext";
import { db } from "../../Firebase";
import { Button } from "react-bootstrap";

const ExerciseNew = () => {
  const useStyles = makeStyles((theme) => ({
    root: {
      color: "#80858a",
      marginLeft: "3%",
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
      width: "8.00rem",
    },
    blueDivider: {
      backgroundColor: "#3358C4",
      height: ".225rem",
      width: "21.50rem",
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

  const history = useHistory();
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
    if (url) parsedUrl = videoIdParser(url);

    console.log(name, stretched, parsedUrl);
    await db
      .collection("therapists")
      .doc(currUser.uid)
      .collection("exercises")
      .where("name", "==", name)
      .get()
      .then((doc) => {
        console.log(doc.exists);
        if (!doc.exists) {
          db.collection("therapists")
            .doc(currUser.uid)
            .collection("exercises")
            .add({
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
        } else {
          alert("You already have this exercise. Try adding another one.");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
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
    return video_id;
  };

  return (
    <div className={classes.root}>
      <Typography variant="h3">Create a New Exercise</Typography>
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
          {console.log("exerciseForm.name", typeof exerciseForm["name"])}
          <TextField
            id="standard-basic"
            label="Name"
            value={exerciseForm.name}
            required
            helperText="Name required."
            error={exerciseForm["name"] === ""}
            id="outlined-error-helper-text"
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
            value={exerciseForm.stretched}
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
            value={exerciseForm.url}
            required
            helperText="URL required."
            error={exerciseForm["url"] === "" || !(exerciseForm["url"].includes("youtube.com"))}
            id="outlined-error-helper-text"
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
        <Button variant="light" type="submit"
          disabled={(exerciseForm["name"] === "") || (exerciseForm["url"] === "") || !(exerciseForm["url"].includes("youtube.com"))}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ExerciseNew;
