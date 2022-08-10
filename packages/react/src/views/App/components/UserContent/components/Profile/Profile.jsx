import React from "react";

// STYLES
import "./Profile.scss";
import userIcon from "../../../../../../assets/user/userIcon.png";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const Profile = () => {
  // PROPS

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <div className="profile-container">
      <div className="profile-friend-request-title-wrapper">
        <span>Friend request</span>
      </div>
      <div className="profile-request">
        <div className="request-user-wrapper">
          <img src={userIcon} alt="user request" />
          <span>Gigel Mirel</span>
        </div>
        <div className="profile-request-buttons-wrapper">
          <HowToRegIcon />
          <DeleteForeverIcon />
        </div>
      </div>
    </div>
  );
};

export default Profile;
