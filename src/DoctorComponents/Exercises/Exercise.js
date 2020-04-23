import React from "react";
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

//commenting for commit

const useStyles = makeStyles({
  root: {
    width: 345,
    height: 200,
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
});

const Exercise = ({ exercise }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        {/* <CardMedia
          component="img"
          //   alt="Contemplative Reptile"
          height="230"
          src={photo}
          //   title="Contemplative Reptile"
        /> */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {exercise.name}
          </Typography>
          <Link
            to={{
              pathname: `/PT/exercises/${exercise.id}`,
            }}
            className={classes.link}
          >
            {" "}
            <Button className={classes.blueButton} variant="outline-primary">
              Edit
            </Button>
          </Link>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Exercise;
