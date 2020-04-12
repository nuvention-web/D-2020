import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { db } from "./Firebase";
import { UserContext } from "./contexts/UserContext";

const useStyles = makeStyles((theme) => ({
  form: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
      textAlign: "center",
      justifyContent: "center",
    },
  },
}));

const NewUserForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const currUser = useContext(UserContext).user;

  const [userInfo, setUserInfo] = useState({
    type: "",
    name: "",
    bio: "",
  });

  const setUserField = (field, data) => {
    setUserInfo({ ...userInfo, [field]: data });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { type, name, bio } = userInfo;
    const Ref = db.collection(type);
    Ref.doc(currUser.uid)
      .set({
        name: name,
        bio: bio,
      })
      .then(function () {
        console.log("Document successfully written!");
        history.push("/");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  return (
    <div>
      <h1>Welcome to our website! Let's get you started!</h1>

      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={userInfo.type}
              onChange={(e) => setUserField("type", e.target.value)}
              label="Type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"patients"}>Patient</MenuItem>
              <MenuItem value={"therapists"}>Therapist</MenuItem>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </div>
        <div>
          <TextField
            id="standard-basic"
            label="Name"
            value={userInfo.name}
            onChange={(e) => setUserField("name", e.target.value)}
          />
        </div>
        <div>
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            value={userInfo.bio}
            onChange={(e) => setUserField("bio", e.target.value)}
            rows={4}
            defaultValue="Default Value"
            variant="outlined"
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default NewUserForm;
