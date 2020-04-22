import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { db, storageRef, firebase } from "../Firebase";
import {
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  TextField,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const ProfileEdit = () => {
  const useStyles = makeStyles((theme) => ({
    form: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
        textAlign: "center",
        justifyContent: "center",
      },
    },
    image: {
      width: "25%",
      height: "25%",
    },
    container: {
      textAlign: "center",
    },
  }));

  const currUser = useContext(UserContext).user;
  const [photo, setPhoto] = useState();
  const [userInfo, setUserInfo] = useState({
    type: "",
    name: "",
    bio: "",
    code: "",
  });
  const history = useHistory();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState();
  const classes = useStyles();
  const preType = localStorage.getItem("type");

  useEffect(() => {
    if (location.userProfile) {
      console.log(location.userProfile);
      localStorage.setItem("userProfile", JSON.stringify(location.userProfile));
      setUserProfile(location.userProfile);
    } else {
      // if refreshed
      const item = JSON.parse(localStorage.getItem("userProfile"));
      console.log(item);
      setUserProfile(item);
    }
  }, []);

  const setUserField = (field, data) => {
    setUserInfo({ ...userInfo, [field]: data });
  };

  const onPhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  function onResolve(foundURL) {
    return true;
  }

  function onReject(error) {
    console.log(error.code);
    return false;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { type, name, bio } = userInfo;
    if (userInfo.code) {
      var code = userInfo.code;
    }
    if (type === "") type = preType;
    if (name === "") name = userProfile.name;
    if (bio === "") bio = userProfile.bio;
    if (code)
      console.log("type: ", type, "name: ", name, "bio: ", bio, "code: ", code);
    const Ref = db.collection(type);

    // If photo was selected
    if (photo) {
      const prevImgRef = storageRef.child(`images/${userProfile.img_name}`);
      const hasPrevImg = storageRef
        .child(`images/${userProfile.img_name}`)
        .getDownloadURL()
        .then(onResolve, onReject);
      if (hasPrevImg === true) await prevImgRef.delete();
      const imageRef = storageRef.child(`images/${photo.name}`);
      const snapshot = await imageRef.put(photo);
      const downloadUrl = await snapshot.ref.getDownloadURL();

      Ref.doc(currUser.uid)
        .update({
          ...userInfo,
          type: type,
          name: name,
          bio: bio,
          img: downloadUrl,
          img_name: photo.name,
          ...(code && code !== ""
            ? { code: code }
            : { code: userProfile.code }),
        })
        .then(function () {
          console.log("Document successfully written!");
          if (code && code !== "") {
            // Update the patient
            const PTRef = db.collection("therapists").doc(code);

            // Atomically add a new patient to the "patients" array field.
            PTRef.update({
              patients: firebase.firestore.FieldValue.arrayUnion(currUser.uid),
            });
            console.log("updated the patient");
          }
          history.push("/profile");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    } else {
      // No photo selected
      Ref.doc(currUser.uid)
        .update({
          ...userInfo,
          name: name,
          type: type,
          bio: bio,
          ...(userProfile.img ? { img: userProfile.img } : { img: "" }),
          ...(userProfile.img_name
            ? { img_name: userProfile.img_name }
            : { img_name: "" }),
          ...(code && code !== ""
            ? { code: code }
            : { code: userProfile.code }),
        })
        .then(function () {
          console.log("Document successfully written!");
          if (code && code !== "") {
            // Update the patient
            const PTRef = db.collection("therapists").doc(code);

            // Atomically add a new patient to the "patients" array field.
            PTRef.update({
              patients: firebase.firestore.FieldValue.arrayUnion(currUser.uid),
            });
            console.log("updated the patient");
          }
          history.push("/profile");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  };
  return (
    <div>
      {userProfile ? (
        <div>
          <h1>Edit your Profile!</h1>
          {console.log(userProfile.name)}
          <form
            className={classes.form}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={userInfo.type !== "" ? userInfo.type : preType}
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
                value={userInfo.name !== "" ? userInfo.name : userProfile.name}
                onChange={(e) => setUserField("name", e.target.value)}
              />
            </div>
            <div>
              <TextField
                id="outlined-multiline-static"
                label="Multiline"
                multiline
                value={userInfo.bio !== "" ? userInfo.bio : userProfile.bio}
                onChange={(e) => setUserField("bio", e.target.value)}
                rows={4}
                defaultValue="Default Value"
                variant="outlined"
              />
            </div>
            {preType && preType == "patients" ? (
              <div>
                <TextField
                  id="standard-basic"
                  label="Your Therapist Code"
                  value={
                    userInfo.code !== "" ? userInfo.code : userProfile.code
                  }
                  onChange={(e) => setUserField("code", e.target.value)}
                />
              </div>
            ) : null}

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
      ) : null}
    </div>
  );
};

export default ProfileEdit;
