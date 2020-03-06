import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import { Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles(theme => ({
    exercises: {
        marginTop: 15,
        minWidth: 250
    }
}));

   
const Landing = () => {
    return(
        <h1>tendon</h1>
    );
}

export default Landing

