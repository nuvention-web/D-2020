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
    maxWidth: 345,
    minHeight: 430,
  },
});

const Patient = ({ p, therapist }) => {
  const classes = useStyles();
  const { name, img, bio, uid } = p;
  console.log(name, img, bio, uid, therapist);
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          //   alt="Contemplative Reptile"
          height="230"
          src={img}
          //   title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {bio}
          </Typography>
        </CardContent>
      </CardActionArea>{" "}
      <CardActions>
        {therapist && therapist.zoom ? (
          <a href={`${therapist.zoom}`} target="_blank">
            <Button size="small" color="primary">
              Start Zoom Call
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
      </CardActions>
    </Card>
  );
};

export default Patient;
