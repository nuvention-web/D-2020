import React, { useContext } from "react";
import { UserContext } from "./contexts/UserContext";

const Profile = (props) => {
  const currUser = useContext(UserContext).user;
  return (
    <div>
      <p>Profile Page</p>
    </div>
  );
};

export default Profile;
