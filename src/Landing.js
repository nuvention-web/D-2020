import React, { useState, useEffect, useContext } from "react";
import { Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import landing_background from "./images/background.png";
import Toolbar from "@material-ui/core/Toolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsAltH,
  faLongArrowAltRight,
} from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import { SignIn, LogOut } from "./Firebase";
import { UserContext } from "./contexts/UserContext";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundImage: `url(${landing_background})`,
    height: "100vh",
    backgroundRepeat: "no-repeat",
  },
  appBar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    height: 100,
    display: "inline-block",
  },
  appBackground: {
    backgroundColor: "#FEFEFE",
    height: "100vh",
  },
  tendonLogo: {
    width: 150,
    float: "left",
    display: "inline-block",
    margin: "40px 30px",
  },
  navBar: {
    float: "right",
    width: "95vh",
    justifyContent: "center",
    margin: "40px 0px",
  },
  navButton: {
    marginRight: "20px",
    display: "inline-block",
    margin: "0px 10px",
    fontSize: 14,
    backgroundColor: "inherit",
    border: "none",
    // fontFamily: "San Francisco",
    "&:hover": {
      color: "#9DB4FF",
      backgroundColor: "inherit",
    },
  },
  accentDivider: {
    content: "",
    display: "block",
    width: "6.25rem",
    height: ".325rem",
    marginTop: "1.5rem",
    background: "#9DB4FF",
  },
  landingLeftText: {
    marginTop: "15vh",
    marginLeft: "3vw",
    color: "#3358C4",
    fontSize: "64px",
    fontWeight: "700",
    width: "30vw",
  },
  subtitle: {
    color: "grey",
    fontSize: "22px",
    fontWeight: "500",
    marginTop: "3vh",
  },
  joinButton: {
    borderRadius: "15px",
    backgroundColor: "#9DB4FF",
    color: "white",
    fontSize: "24px",
    padding: "12px",
    border: "none",
    width: "9vw",
  },
  rightButtons: {
    display: "flex",
    float: "right",
  },
  registerButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    fontSize: "18px",
    padding: "8px",
    fontWeight: "600",
    marginRight: "55px",
  },
  logInButton: {
    borderRadius: "11px",
    backgroundColor: "white",
    border: "none",
    color: "#3358C4",
    fontSize: "18px",
    width: "7vw",
    padding: "8px",
    //   marginLeft: '-10px',
    fontWeight: "600",
  },
  space: {
    width: "50px",
  },
}));

const Landing = () => {
  const classes = useStyles();

  //Access currentUser info from anywhere in the app using context
  const currUser = useContext(UserContext).user;

  return (
    <div className={classes.background}>
      {/* <h1>hi</h1> */}
      <nav>
        <AppBar position="static" className={classes.appBar}>
          <img className={classes.tendonLogo} src="/img/tendonlogo.png"></img>
          <Toolbar className={classes.navBar}>
            <Link to="/">
              <Button variant="light" className={classes.navButton}>
                Landing Page
              </Button>
            </Link>
            <Link to="/PT">
              <Button variant="light" className={classes.navButton}>
                PT View
              </Button>
            </Link>
            <Link to="/workout">
              <Button variant="light" className={classes.navButton}>
                Patient View
              </Button>
            </Link>
            <div className={classes.space}></div>
            <div className={classes.rightButtons}>
              {currUser ? (
                <Button
                  variant="light"
                  clasName={classes.registerButton}
                  onClick={() => {
                    LogOut();
                  }}
                ></Button>
              ) : (
                <SignIn />
              )}
            </div>
          </Toolbar>
        </AppBar>
      </nav>
      <div className={classes.landingLeftText}>
        <p>
          PT <FontAwesomeIcon icon={faArrowsAltH} color="#9DB4FF" />{" "}
          &nbsp;patient relationships first.
        </p>
        <p className={classes.subtitle}>
          We believe that quality care begins with a strong relationship between
          physical therapist and patient.
        </p>
        <button className={classes.joinButton}>
          Join us &nbsp;&nbsp;
          <FontAwesomeIcon icon={faLongArrowAltRight} color="white" />{" "}
        </button>
      </div>
    </div>
  );
};

export default Landing;
