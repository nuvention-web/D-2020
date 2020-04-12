import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./contexts/UserContext";
import { db } from "./Firebase";
import { Button } from "@material-ui/core";

const Profile = (props) => {
  const currUser = useContext(UserContext).user;
  const type = localStorage.getItem("type");
  console.log(type);
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    if (Object.entries(currUser).length >= 1 && type) {
      db.collection(type)
        .doc(currUser.uid)
        .get()
        .then(function (doc) {
          setUserProfile(doc.data());
        });
    }
  }, [type, currUser]);

  // Needs to implement the edit side
  const handleEdit = () => {};

  console.log(userProfile);
  return (
    <div>
      <h1>Profile Page</h1>
      {userProfile ? (
        <div>
          <p>Name: {userProfile.name}</p>
          <p>Bio : {userProfile.bio}</p>
          <img src={`${userProfile.img}`}></img>
          <div>
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
