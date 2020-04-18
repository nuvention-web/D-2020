import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { db } from "../Firebase";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Container,
} from "@material-ui/core";

const Profile = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      textAlign: "center",
    },
    card: {
      margin: "0 auto",
      maxWidth: 345,
      minHeight: 430,
    },
    image: {
      width: "100%",
      height: "100%",
    },
  }));
  const currUser = useContext(UserContext).user;
  const type = localStorage.getItem("type");
  const [userProfile, setUserProfile] = useState();
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    if (Object.entries(currUser).length >= 1 && type) {
      db.collection(type)
        .doc(currUser.uid)
        .get()
        .then(function (doc) {
          setUserProfile(doc.data());
        });
    }
  }, [type, currUser]);

  return (
    <div>
      <Container>
        <Typography gutterBottom variant="h5" component="h2">
          Profile Page
        </Typography>{" "}
        {userProfile ? (
          <div className={classes.root}>
            <Card className={classes.card}>
              <CardMedia
                component="img"
                height="230"
                src={`${userProfile.img}`}
                alt=""
                className={classes.image}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Name: {userProfile.name}
                </Typography>
                {type && type === "therapists" ? (
                  <div>
                    <hr />
                    <Typography
                      variant="h7"
                      color="textSecondary"
                      component="p"
                    >
                      Connect with your patient with this code:
                      <strong>{currUser.uid}</strong>
                    </Typography>
                    <hr />
                  </div>
                ) : null}

                <Typography variant="body2" color="textSecondary" component="p">
                  Bio: {userProfile.bio}
                </Typography>
              </CardContent>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    history.push({
                      pathname: "/profile/edit",
                      userProfile: userProfile,
                    })
                  }
                >
                  Edit
                </Button>
                {/* <a href="/profile/edit">Edit</a> */}
              </div>
            </Card>
          </div>
        ) : (
          <div>
            {" "}
            <Typography variant="h2" color="textSecondary" component="h2">
              You haven't made your profile yet:
            </Typography>
            <a href="/newUser">Go build you profile</a>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Profile;
