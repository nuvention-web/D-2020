import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  TextField,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { db, storageRef } from "./Firebase";
import { UserContext } from "./contexts/UserContext";
import { Button } from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "#80858a",
    marginLeft: "3%",
  },
  form: {
    textAlign: "left",
    marginTop: "3%",
    "& > *": {
      marginTop: theme.spacing(5),
      width: "25ch",
    },
  },
  profileType: {
    width: "150%",
    fontSize: 18,
  },
  nameField: {
    width: "130%",
  },
  addPhoto: {
    marginBottom: "-1.5%",
  },
  bio: {
    width: "130%",
  },
  purpleDivider: {
    backgroundColor: "#9DB4FF",
    height: ".225rem",
    width: "8.00rem",
  },
  blueDivider: {
    backgroundColor: "#3358C4",
    height: ".225rem",
    width: "18.50rem",
  },
  dividers: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: "1.5%",
  },
  resize: {
    fontSize: 18,
  },
}));

const NewUserForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const currUser = useContext(UserContext).user;
  const [photo, setPhoto] = useState();
  const [userInfo, setUserInfo] = useState({
    type: "",
    name: "",
    bio: "",
  });
  const [noType, setNoType] = useState(false);
  const [noName, setNoName] = useState(false);
  const [noBio, setNoBio] = useState(false);

  const setUserField = (field, data) => {
    setUserInfo({ ...userInfo, [field]: data });
  };

  const onPhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { type, name, bio } = userInfo;

    if (userInfo.type !== "" && userInfo.name !== "") {
      const Ref = db.collection(type);

      //case where user doesn't upload pic
      var downloadUrl = "";
      if (photo) {
        const imageRef = storageRef.child(`images/${photo.name}`);
        const snapshot = await imageRef.put(photo);
        downloadUrl = await snapshot.ref.getDownloadURL();
      }
      Ref.doc(currUser.uid)
        .set({
          ...userInfo,
          name: name,
          bio: bio,
          img: downloadUrl,
          dateCreated: new Date(),
        })
        .then(function () {
          console.log("Document successfully written!");
          localStorage.setItem("type", userInfo.type);
          history.push({
            pathname: "/profile",
            notNewUser: true,
          });
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    } else {
      alert("Please complete the 'type' and 'name' fields first");
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h3">Welcome to Tendon</Typography>
      <div className={classes.dividers}>
        <div className={classes.purpleDivider}></div>
        <div className={classes.blueDivider}></div>
      </div>
      <Typography variant="h5">Let's make your profile</Typography>

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
              onChange={(e) => {
                setUserField("type", e.target.value);
                if (e.target.value == "") {
                  setNoType(true);
                }
                else {
                  setNoType(false);
                }}}
              label="Type"
              className={classes.profileType}
              error={noType}
              id="outlined-error-helper-text"
            >
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
            onChange={(e) => {
              setUserField("name", e.target.value);
              if (e.target.value == "") {
                setNoName(true);
              }
              else {
                setNoName(false);
              }}}
            className={classes.nameField}
            InputProps={{
              classes: {
                input: classes.resize,
              },
            }}
            error={noName}
            id="outlined-error-helper-text"
          />
        </div>
        <div>
          <TextField
            id="outlined-multiline-static"
            label="Bio"
            multiline
            value={userInfo.bio}
            onChange={(e) => {
              setUserField("bio", e.target.value);
              if (e.target.value == "") {
                setNoBio(true);
              }
              else {
                setNoBio(false);
              }}}
            rows={4}
            defaultValue="Default Value"
            variant="outlined"
            className={classes.bio}
            InputProps={{
              classes: {
                input: classes.resize,
              },
            }}
            error={noBio}
            id="outlined-error-helper-text"
          />
        </div>
        <p className={classes.addPhoto}>Add a photo of you:</p>
        <input
          fullWidth
          margin="normal"
          variant="outlined"
          type="file"
          className="input-button"
          accept="image/*"
          onChange={onPhotoChange}
        />
        <br />
        <Button
          variant="light"
          type="submit"
          disabled={
            userInfo["type"] === "" ||
            userInfo["name"] === "" ||
            userInfo["bio"] === ""
          }
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default NewUserForm;
