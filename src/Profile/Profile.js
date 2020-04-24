import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { db } from "../Firebase";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
} from "@material-ui/core";
import { Button } from "react-bootstrap";

const Profile = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      textAlign: "center",
      color: "#80858a",
    },
    card: {
      marginTop: "3%",
      margin: "0 auto",
      width: "45vh",
      minHeight: "60vh",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    editButton: {
      marginBottom: "2%",
    },
    bio: {
      textAlign: "justify",
      textJustify: "inter-word",
    },
  }));
  const currUser = useContext(UserContext).user;
  const type = localStorage.getItem("type");
  const [userProfile, setUserProfile] = useState();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  //if profile pic is not uploaded use blank
  const [profilePic, setProfilePic] = useState("/img/blankProfile.png");

  useEffect(() => {
    if (Object.entries(currUser).length > 0 && type) {
      db.collection(type)
        .doc(currUser.uid)
        .get()
        .then(function (doc) {
          setUserProfile(doc.data());
          if (doc.data().img !== "") {
            setProfilePic(`${doc.data().img}`);
          }
        });
    }
  }, [type, currUser, location]);

  return (
    <div>
      <Container className={classes.root}>
        <Typography gutterBottom variant="h3">
          Your Profile
        </Typography>{" "}
        {console.log(profilePic)}
        {userProfile ? (
          <div className={classes.root}>
            <Card className={classes.card}>
              <CardMedia
                component="img"
                height="230"
                src={profilePic}
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

                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.bio}
                >
                  Bio: {userProfile.bio}
                </Typography>
              </CardContent>
              <div>
                <Button
                  variant="light"
                  onClick={() =>
                    history.push({
                      pathname: "/profile/edit",
                      userProfile: userProfile,
                    })
                  }
                  className={classes.editButton}
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
