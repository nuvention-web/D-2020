import React, { useContext, useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import { SignIn, LogOut } from "../Firebase";
import { Link } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import { Button, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import "../App.css";
import { createMuiTheme } from "@material-ui/core/styles";
import { Menu } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";

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
    width: "95vh",
    justifyContent: "center",
    margin: "40px 0px",
  },
  navLink: {
    color: "black",
    marginRight: "40px",
    fontSize: "18px",
    fontWeight: 300,
    "&:hover": {
      color: "#3358C4",
      textDecoration: "none",
      borderBottom: "2px solid #3358C4",
      paddingBottom: 3,
    },
    // padding: "30px 0px",
    paddingTop: "30px",
  },
  navLogout: {
    color: "black",
    marginRight: "40px",
    fontSize: "18px",
    fontWeight: 300,
    "&:hover": {
      color: "#3358C4",
      textDecoration: "none",
      boxShadow: "0 0.2rem 0.5rem #c7c7c7",
    },
    border: "none",
    outline: 0,
    padding: "10px 25px",
    borderRadius: 15,
    boxShadow: "0 0.2rem 0.5rem #d6d6d6",
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
  root: {
    position: "absolute",
    right: 20,
  },
  buttonBar: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
    margin: "10px",
    marginTop: "80px",
    paddingLeft: "16px",
    position: "relative",
    width: "100%",
    background: "transparent",
  },
  buttonCollapse: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
    marginTop: "80px",
    boxShadow: "none",
    marginRight: "20px",
  },
}));

const NavBar = ({ haveLoggedIn, setHaveLoggedIn }) => {
  const ButtonAppBar = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEL] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
      setAnchorEL(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEL(null);
    };

    return (
      <div className={classes.root}>
        <div className={classes.buttonCollapse}>
          <IconButton onClick={(e) => handleMenu(e)}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={() => handleClose()}
          >
            {Object.entries(currUser).length >= 1 && type == "therapists" ? (
              <MenuItem>
                <Link to="/PT" className={classes.navLink}>
                  PT View
                </Link>
              </MenuItem>
            ) : null}
            {Object.entries(currUser).length >= 1 && type == "patients" ? (
              <MenuItem>
                <Link
                  to={{
                    pathname: "/workout",
                    state: { userId: currUser.uid },
                  }}
                  className={classes.navLink}
                >
                  {/* <Button variant="light" className={classes.navButton}> */}
                  Exercise Tracking
                  {/* </Button> */}
                </Link>
              </MenuItem>
            ) : null}

            {Object.entries(currUser).length >= 1 ? (
              <MenuItem>
                <Link to={{ pathname: "/profile" }} className={classes.navLink}>
                  Profile
                </Link>{" "}
              </MenuItem>
            ) : null}
            <div className={classes.rightButtons}>
              {Object.entries(currUser).length < 1 ? (
                <MenuItem>
                  <SignIn />
                </MenuItem>
              ) : (
                <MenuItem>
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
                </MenuItem>
              )}
            </div>
          </Menu>
        </div>
        <div className={classes.buttonBar} id="appbar-collapse">
          {Object.entries(currUser).length >= 1 && type == "therapists" ? (
            <Link to="/PT" className={classes.navLink}>
              PT View
            </Link>
          ) : null}

          {Object.entries(currUser).length >= 1 && type == "patients" ? (
            <Link
              to={{
                pathname: "/workout",
                state: { userId: currUser.uid },
              }}
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
        </div>
      </div>
    );
  };

  const classes = useStyles();
  const currUser = useContext(UserContext).user;
  const setCurrUser = useContext(UserContext).setUser;
  const history = useHistory();
  const type = localStorage.getItem("type");

  useEffect(() => {
    console.log("have changed");
    console.log("local storage in Navbar: ", type);
    if (localStorage.getItem("type") !== "") {
      setHaveLoggedIn(true);
      // console.log("THis is the userType from navBar: ", type);
      // setDummyState(true);
    }
  }, [currUser, type]);

  return (
    <nav>
      <AppBar position="static" className={classes.appBar}>
        <Link to="/">
          <img className={classes.tendonLogo} src="/img/tendonlogo.png"></img>{" "}
        </Link>
        <Toolbar>
          <ButtonAppBar />
        </Toolbar>
      </AppBar>
      {/* </ThemeProvider> */}
    </nav>
  );
};

export default NavBar;
