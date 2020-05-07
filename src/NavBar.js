import React, { useContext, useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import { SignIn, LogOut } from "./Firebase";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import { Button } from "@material-ui/core";
// import { Button } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "./contexts/UserContext";
import { useHistory } from "react-router-dom";
import "./App.css";
import { createMuiTheme } from '@material-ui/core/styles';
// import { ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  // typography: {
  //   fontFamily: [
  //     '-apple-system',
  //     'BlinkMacSystemFont',
  //     '"Segoe UI"',
  //     'Roboto',
  //     '"Helvetica Neue"',
  //     'Arial',
  //     'sans-serif',
  //     '"Apple Color Emoji"',
  //     '"Segoe UI Emoji"',
  //     '"Segoe UI Symbol"',
  //   ].join(','),
  // },
  // color: 'pink',
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    height: 100,
    display: "inline-block",
    // boxShadow: '0px 1px 10px #999',
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
  navLink: {
    color: 'black',
    margin: "0px 10px",
    marginRight: "50px",
    fontSize: '18px',
    fontWeight: 300,
    "&:hover": {
      color: '#3358C4',
      textDecoration: 'none',
      borderBottom: '2px solid #3358C4',
      paddingBottom: 3,
    },
  },
  navLogout: {
    color: 'black',
    margin: "0px 10px",
    marginRight: "50px",
    fontSize: '18px',
    fontWeight: 300,
    "&:hover": {
      color: '#3358C4',
      textDecoration: 'none',
      boxShadow: '0 0.2rem 0.5rem #c7c7c7',
    },
    // '&$focused': {
    //   outline: 'none',
    // },
    border: 'none',
    outline: 0,
    padding: '10px 25px',
    borderRadius: 15,
    // boxShadow: "2px 2px 5px 0px #80858a, 0 0 0 1px #fff",
    boxShadow: '0 0.2rem 0.5rem #d6d6d6',
  },
  // navButton: {
  //   marginRight: "20px",
  //   display: "inline-block",
  //   margin: "0px 10px",
  //   fontSize: 14,
  //   backgroundColor: "inherit",
  //   border: "none",
  //   outline: "none",
  //   "&:hover": {
  //     color: "#9DB4FF",
  //     backgroundColor: "inherit",
  //   },
  // },
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
      {/* <ThemeProvider theme={theme}> */}
      <AppBar position="static" className={classes.appBar}>
        <Link to="/">
          <img className={classes.tendonLogo} src="/img/tendonlogo.png"></img>{" "}
        </Link>
        <Toolbar className={classes.navBar}>
          {console.log(typeof type)}
          {Object.entries(currUser).length >= 1 && type == "therapists" ? (
            <Link to="/PT" className={classes.navLink}>
              PT View
              </Link>
          ) : null}
          {Object.entries(currUser).length >= 1 && type == "patients" ? (
            <Link
              to={{ pathname: "/workout", state: { userId: currUser.uid } }}
              className={classes.navLink}
            >
              {/* <Button variant="light" className={classes.navButton}> */}
              Exercise Tracking
              {/* </Button> */}
            </Link>
          ) : null}
          {Object.entries(currUser).length >= 1 ? (
            <Link to={{ pathname: "/profile" }} className={classes.navLink}>
              Profile
              </Link>
          ) : null}
          <div className={classes.space}></div>
          <div className={classes.rightButtons}>
            {Object.entries(currUser).length < 1 ? (
              <SignIn />
            ) : (
                <button
                  variant="light"
                  className={classes.navLogout}
                  onClick={() => {
                    LogOut();
                    history.push("/");
                    setCurrUser({});
                  }}
                >
                  Log Out
              </button>
              )}
          </div>
        </Toolbar>
      </AppBar>
      {/* </ThemeProvider> */}
    </nav>
  );
};

export default NavBar;
