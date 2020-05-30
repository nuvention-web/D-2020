import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CardActionArea,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

//commenting for commit

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    minHeight: 390,
  },
  content: {
    minHeight: 130,
  },
  link: {
    marginLeft: 10,
  },
});

const Patient = ({ p, therapist }) => {
  const classes = useStyles();
  const { name, img, bio, uid } = p;
  //if profile pic is not uploaded use blank
  const blankProfPic = "/img/blankProfile.png";

  console.log(name, img, bio, uid);
  console.log(therapist, therapist.zoom);
  return (
    <Card className={classes.root}>
      <CardMedia
        component="img"
        //   alt="Contemplative Reptile"
        height="230"
        src={img != "" ? img : blankProfPic}
        //   title="Contemplative Reptile"
      />
      <CardContent className={classes.content}>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {bio}
        </Typography>
      </CardContent>
      {therapist && therapist.zoom ? (
        <a href={therapist.zoom} target="_blank">
          <Button size="small" color="primary">
            Start Online Meeting
          </Button>
        </a>
      ) : null}
      <Link
        to={{
          pathname: `/PT/patient/${uid}`,
          patientInfo: p,
        }}
        className={classes.link}
      >
        <Button size="small" color="primary">
          More Info
        </Button>
      </Link>
    </Card>
  );
};

export default Patient;
