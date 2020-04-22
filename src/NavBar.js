import React, { useContext, useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import { SignIn, LogOut } from "./Firebase";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "./contexts/UserContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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
    border: "none",
    fontSize: "14px",
    padding: "8px",
    marginRight: "0px",
    "&:hover": {
      color: "#9DB4FF !important",
      backgroundColor: "inherit",
    },
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
    width: "100px",
  },
}));

const NavBar = ({ haveLoggedIn }) => {
  const classes = useStyles();
  const currUser = useContext(UserContext).user;
  const setCurrUser = useContext(UserContext).setUser;
  const history = useHistory();
  const [type, setType] = useState(localStorage.getItem("type"));
  const [dummyState, setDummyState] = useState();
  useEffect(() => {
    console.log("have changed");
    console.log("local storage in Navbar: ", localStorage.getItem("type"));
    if (localStorage.getItem("type") !== "") {
      setType(localStorage.getItem("type"));
      // console.log("THis is the userType from navBar: ", type);
      // setDummyState(true);
    }
  }, [currUser, haveLoggedIn]);

  return (
    <nav>
      <AppBar position="static" className={classes.appBar}>
        <Link to="/">
          <img className={classes.tendonLogo} src="/img/tendonlogo.png"></img>{" "}
        </Link>
        <Toolbar className={classes.navBar}>
          {console.log(typeof type)}
          {Object.entries(currUser).length >= 1 && type == "therapists" ? (
            <Link to="/PT">
              <Button variant="light" className={classes.navButton}>
                PT View
              </Button>
            </Link>
          ) : null}
          {Object.entries(currUser).length >= 1 && type == "patients" ? (
            <Link
              to={{ pathname: "/workout", state: { userId: currUser.uid } }}
            >
              <Button variant="light" className={classes.navButton}>
                Exercise Tracking
              </Button>
            </Link>
          ) : null}
          {Object.entries(currUser).length >= 1 ? (
            <Link to={{ pathname: "/profile" }}>
              <Button variant="light" className={classes.navButton}>
                Profile
              </Button>
            </Link>
          ) : null}
          <div className={classes.space}></div>
          <div className={classes.rightButtons}>
            {Object.entries(currUser).length < 1 ? (
              <SignIn />
            ) : (
              <Button
                variant="light"
                className={classes.registerButton}
                onClick={() => {
                  LogOut();
                  history.push("/");
                  setCurrUser({});
                }}
              >
                Log Out
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </nav>
  );
};

export default NavBar;
