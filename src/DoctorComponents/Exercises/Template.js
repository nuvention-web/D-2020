import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CardActionArea,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { db } from "../../Firebase";
//commenting for commit

const useStyles = makeStyles({
  root: {
    width: 345,
    height: 200,
    textAlign: "right",
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
    margin: 3,
  },
});

const Template = ({ template, currUser, setDeleted }) => {
  const classes = useStyles();

  const handleDelete = () => {
    db.collection("therapists")
      .doc(currUser.uid)
      .collection("templates")
      .doc(template.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        setDeleted(true);
        // Should only reload if previous chunk of code has run..
        window.location.reload(false);
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
    
  };

  return (
    <Card className={classes.root}>
      {/* <CardMedia
          component="img"
          //   alt="Contemplative Reptile"
          height="230"
          src={photo}
          //   title="Contemplative Reptile"
        /> */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {template.name}
        </Typography>
        <Link
          to={{
            pathname: `/PT/exercises/templates/${template.id}`,
          }}
          className={classes.link}
        >
          {" "}
          <Button className={classes.blueButton} variant="outline-primary">
            Edit
          </Button>
        </Link>
        <Button
          className={classes.blueButton}
          variant="outline-primary"
          onClick={() => handleDelete()}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default Template;
