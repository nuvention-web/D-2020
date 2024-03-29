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
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { Button } from "react-bootstrap";
import StripeCheckoutButton from "../StripeButton/StripeCheckoutButton";

const Profile = ({ setHaveLoggedIn }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      textAlign: "center",
      color: "#80858a",
    },
    rootGrid: {
      display: "flex",
      flexWrap: "wrap",
    },
    card: {
      marginTop: "3%",
      margin: "0 auto",
      width: "50vh",
      minHeight: "60vh",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    editButton: {
      backgroundColor: "#9DB4FF",
      color: "white",
      border: "none",
      height: "calc(1.5em + .75rem + 2px)",
      "&:hover": {
        color: "white",
        backgroundColor: "#3358C4",
      },
    },
    bio: {
      textAlign: "justify",
      textJustify: "inter-word",
    },
    loadingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "40vh",
    },
    explanation: {
      [theme.breakpoints.down("sm")]: {
        width: "90%",
      },
      width: "70%",
      marginTop: "25px",
    },
    checkOut: {
      marginTop: "20px",
    },
    // darkButton: {
    //   backgroundColor: "#3358C4",
    //   border: "none",
    //   "&:hover": {
    //     backgroundColor: "#264291",
    //   },
    //   marginBottom: 15,
    // },
    blueButton: {
      backgroundColor: "#3358C4",
      color: "white",
      border: "none",
      height: "calc(1.5em + .75rem + 2px)",
      "&:hover": {
        color: "white",
        backgroundColor: "#9DB4FF",
      },
      marginBottom: 15,
    },
    pricingContainer: {
      [theme.breakpoints.down("sm")]: {
        marginTop: 50,
        marginLeft: 35,
      },
    },
    pricingHeader: {
      [theme.breakpoints.down("sm")]: {
        textAlign: "center",
        marginLeft: -60,
      },
    },
  }));
  const currUser = useContext(UserContext).user;
  const type = localStorage.getItem("type");
  const [userProfile, setUserProfile] = useState({});
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const subscriptionFee = 20;
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
        })
        .then(setLoaded(true));
    }
  }, [type, currUser, location]);

  useEffect(() => {
    if (location.notNewUser) setHaveLoggedIn(true);
  }, []);

  const renderPT = () => {
    return (
      <div>
        <Grid container className={classes.rootGrid}>
          <Grid item xs={12} sm={6}>
            <Container className={classes.root}>
              <Typography gutterBottom variant="h3">
                Your Profile
              </Typography>{" "}
              {console.log(profilePic)}
              {userProfile != {} ? (
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
                      {type &&
                      type === "therapists" &&
                      userProfile.zoom &&
                      userProfile.zoom !== "" ? (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                          className={classes.bio}
                        >
                          Zoom Link: {userProfile.zoom}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                          className={classes.bio}
                        >
                          Insert your Zoom personal meeting room url to hold
                          meetings with your patients instantly!
                        </Typography>
                      )}
                    </CardContent>
                    <div>
                      <Button
                        variant="outline-primary"
                        className={classes.blueButton}
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
          </Grid>
          {/* Payment Info */}
          <Grid item xs={12} sm={6}>
            <Container className={classes.pricingContainer}>
              <Typography
                variant="h4"
                color="textSecondary"
                component="h2"
                className={classes.pricingHeader}
              >
                Our Pricing Policy{" "}
              </Typography>
              <div className={classes.explanation}>
                <Typography variant="h7" color="textSecondary" component="h7">
                  We want to share your passion and mission in helping patients
                  throughout this crisis, and won't require subscription fee
                  until the CoVid-19 crisis dwindle down.
                </Typography>
              </div>
              <div className={classes.checkOut}>
                <StripeCheckoutButton price={subscriptionFee} />
              </div>
            </Container>
          </Grid>
        </Grid>
      </div>
    );
  };

  const renderPatient = () => {
    return (
      <div>
        <Container className={classes.root}>
          <Typography gutterBottom variant="h3">
            Your Profile
          </Typography>{" "}
          {console.log(profilePic)}
          {userProfile != {} ? (
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
                    variant="outline-primary"
                    className={classes.blueButton}
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

  if (loaded) {
    // include payment information
    if (type && type === "therapists") return renderPT();
    else return renderPatient();
  } else {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }
};

export default Profile;
