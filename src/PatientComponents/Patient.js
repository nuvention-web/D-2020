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

//commenting for commit

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    minHeight: 430,
  },
});

const Patient = ({ name, photo, bio }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          //   alt="Contemplative Reptile"
          height="230"
          src={photo}
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
      </CardActionArea>
      {/* <CardActions>
        <Button size="small" color="primary">
          View Routine
        </Button>
        <Button size="small" color="primary">
          Progress
        </Button>
      </CardActions> */}
    </Card>
  );
};

export default Patient;
