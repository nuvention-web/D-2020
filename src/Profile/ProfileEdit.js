import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { db, storageRef, firebase } from "../Firebase";
import {
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  TextField,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "react-bootstrap";

const ProfileEdit = () => {
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
    image: {
      width: "25%",
      height: "25%",
    },
    profileType: {
      width: "150%",
      fontSize: 18,
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
      width: "6.00rem",
    },
    blueDivider: {
      backgroundColor: "#3358C4",
      height: ".225rem",
      width: "15.00rem",
    },
    dividers: {
      display: "flex",
      flexDirection: "row",
      marginTop: 10,
    },
    nameField: {
      width: "130%",
    },
    codeField: {
      width: "130%",
    },
    resize: {
      fontSize: 18,
    },
    button: {
      marginRight: "10px",
      backgroundColor: "#3358C4",
      width: "100px",
    },
  }));

  const currUser = useContext(UserContext).user;
  const [photo, setPhoto] = useState();
  const [userInfo, setUserInfo] = useState({
    type: "",
    name: "",
    bio: "",
    code: "",
    zoom: "",
  });
  const history = useHistory();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState();
  const classes = useStyles();
  const preType = localStorage.getItem("type");

  useEffect(() => {
    if (location.userProfile) {
      console.log("location.userProfile", location.userProfile);
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
    console.log("setUserField", userInfo);
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
    if (userInfo.zoom) {
      var zoom = userInfo.zoom;
    }
    if (type === "") type = preType;
    if (name === "") name = userProfile.name;
    if (bio === "") bio = userProfile.bio;
    if (code === "" && userProfile.code) var code = userProfile.code;
    if (zoom === "" && userProfile.zoom) var zoom = userProfile.zoom;

    console.log(
      "type: ",
      type,
      "name: ",
      name,
      "bio: ",
      bio,
      "code: ",
      code,
      "zoom: ",
      zoom
    );
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

      console.log(Ref);
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
          ...(zoom && zoom !== ""
            ? { zoom: zoom }
            : { zoom: userProfile.zoom }),
        })
        .then(function () {
          console.log("Document successfully written!");
          console.log("condition", code && code !== "");
          if (code && code !== "") {
            // Update the patient
            const PTRef = db.collection("therapists").doc(code);
            console.log("therapist ref", PTRef);

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
            : userProfile.code
            ? { code: userProfile.code }
            : { code: null }),
          ...(zoom && zoom !== ""
            ? { zoom: zoom }
            : userProfile.zoom
            ? { zoom: userProfile.zoom }
            : { zoom: null }),
        })
        .then(function () {
          if (type == "patients") {
            console.log("Document successfully written!");
            if (code && code !== "") {
              // Update the patient
              const PTRef = db.collection("therapists").doc(code);

              // Atomically add a new patient to the "patients" array field.
              PTRef.update({
                patients: firebase.firestore.FieldValue.arrayUnion(
                  currUser.uid
                ),
              });
              console.log("updated the patient");
            }
          }
          history.push("/profile");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  };
  return (
    <div className={classes.root}>
      {userProfile ? (
        <div>
          <Typography variant="h3">Edit Your Profile</Typography>
          <div className={classes.dividers}>
            <div className={classes.purpleDivider}></div>
            <div className={classes.blueDivider}></div>
          </div>
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
                  Profile Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={userInfo.type !== "" ? userInfo.type : preType}
                  onChange={(e) => setUserField("type", e.target.value)}
                  label="Profile Type"
                  className={classes.profileType}
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
                defaultValue={userProfile.name}
                onChange={(e) => setUserField("name", e.target.value)}
                className={classes.nameField}
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
              />
            </div>
            <div>
              <TextField
                id="outlined-multiline-static"
                label="Bio"
                multiline
                // value={userInfo.bio !== "" ? userInfo.bio : userProfile.bio}
                onChange={(e) => setUserField("bio", e.target.value)}
                rows={4}
                defaultValue={userProfile.bio}
                variant="outlined"
                className={classes.bio}
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
              />
            </div>
            {preType && preType == "patients" ? (
              <div>
                <TextField
                  id="standard-basic"
                  label="Your Therapist Code"
                  // value={userInfo.code !== "" ? userInfo.code : userProfile.code}
                  defaultValue={userProfile.code}
                  onChange={(e) => setUserField("code", e.target.value)}
                  className={classes.codeField}
                  InputProps={{
                    classes: {
                      input: classes.resize,
                    },
                  }}
                />
              </div>
            ) : null}
            {preType && preType == "therapists" ? (
              <div>
                <TextField
                  id="standard-basic"
                  label="Enter personal zoom link"
                  defaultValue={
                    userInfo.zoom && userInfo.zoom !== ""
                      ? userInfo.zoom
                      : userProfile.zoom
                  }
                  onChange={(e) => setUserField("zoom", e.target.value)}
                  className={classes.codeField}
                  InputProps={{
                    classes: {
                      input: classes.resize,
                    },
                  }}
                />
              </div>
            ) : null}

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
              color="primary"
              className={classes.button}
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>
            <Button color="primary" className={classes.button} type="submit">
              Submit
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileEdit;
