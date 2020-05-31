import React, { useState } from "react";
import { Modal, Typography, makeStyles } from "@material-ui/core";
import {
  Stepper,
  CardActionArea,
  Card,
  CardContent,
  CardMedia,
  Step,
  StepLabel,
  Button,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalStyle: {
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
  },
  tempPaper: {
    position: "absolute",
    width: 700,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  header: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 24,
    },
    marginTop: 10,
    marginBottom: 8,
    color: "#80858a",
  },
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  cardRoot: {
    width: 200,
    height: 100,
    textAlign: "center",
    backgroundColor: "lightGray",
  },
  templateGridContainer: {
    marginTop: 40,
    marginBottom: "4%",
  },
  templateGrid: {
    marginTop: 15,
    marginRight: 15,
    display: "flex",
    flexWrap: "wrap",
  },
}));

const getSteps = () => {
  return [
    "Choose a template you want to add",
    "Select days you want to apply",
    "Confirm your choices",
  ];
};

const TempModal = ({ template, templateOpen, handleCloseTemplate }) => {
  const getModalStyle = () => {
    return {
      top: `${50}%`,
      left: `${50}%`,
      transform: `translate(-${50}%, -${50}%)`,
    };
  };
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      //Choose Template
      case 0:
        return (
          <div>
            <Typography variant="h6" className={classes.header}>
              Choose a template you want to add
            </Typography>
            <Grid container className={classes.templateGridContainer}>
              {template.map((temp, i) => (
                <Grid item key={i} className={classes.templateGrid}>
                  <Card className={classes.cardRoot}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {temp.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        );
      case 1:
        return "What is an ad group anyways?";
      case 2:
        return "This is the bit I really care about!";
      default:
        return "Unknown stepIndex";
    }
  };
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  // Stepper state
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Modal
      open={templateOpen}
      onClose={handleCloseTemplate}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle} className={classes.tempPaper}>
        {/* Stepper */}
        <div className={classes.root}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed
                </Typography>
                <Button onClick={handleReset}>Reset</Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>
                  {getStepContent(activeStep)}
                </Typography>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TempModal;
