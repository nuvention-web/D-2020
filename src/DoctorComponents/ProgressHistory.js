import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../contexts/UserContext";
import {
    Container,
    Typography,
    Divider,
    CircularProgress,
  } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        color: "#80858a"
    },
    accentDivider: {
        content: "",
        display: "block",
        width: "6.25rem",
        height: ".325rem",
        marginTop: "1.5rem",
        background: "#9DB4FF",
    },

}));

const ProgressHistory = (props) => {
    const classes = useStyles();
    
    return(
        <div className={classes.root}>
            <Container>
                <Typography variant="h3">Progress Overview</Typography>
                <div className={classes.accentDivider}></div>
            </Container>
        </div>
    );
};

export default ProgressHistory;