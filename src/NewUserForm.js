import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
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
  const [photo, setPhoto] = useState();
  const [userInfo, setUserInfo] = useState({
    type: "",
    name: "",
    bio: "",
  });

  const setUserField = (field, data) => {
    setUserInfo({ ...userInfo, [field]: data });
  };

  const onPhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { type, name, bio } = userInfo;
    const Ref = db.collection(type);
    const imageRef = storageRef.child(`images/${photo.name}`);
    const snapshot = await imageRef.put(photo);
    const downloadUrl = await snapshot.ref.getDownloadURL();

    Ref.doc(currUser.uid)
      .set({
        ...userInfo,
        name: name,
        bio: bio,
        img: downloadUrl,
      })
      .then(function () {
        console.log("Document successfully written!");
        history.push("/profile");
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
        <p>Add a photo of you:</p>
        <input
          fullWidth
          margin="normal"
          variant="outlined"
          type="file"
          className="input-button"
          accept="image/*"
          onChange={onPhotoChange}
        />
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default NewUserForm;
