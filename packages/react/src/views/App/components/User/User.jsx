import React from "react";

// STYLES
import "./User.scss";

// LIBRARIES
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MessageIcon from "@mui/icons-material/Message";

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const User = (props) => {
  // PROPS
  const { onClick = () => {} } = props;
  // CONSTANTS USING LIBRARIES

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <div className="user-container">
      <div className="icons-wrapper">
        <div
          onClick={() => {
            onClick("profile");
          }}
        >
          <PersonIcon />
        </div>
        <div
          onClick={() => {
            onClick("add-friend");
          }}
        >
          <PersonAddAlt1Icon />
        </div>
        <div
          onClick={() => {
            onClick("friendships");
          }}
        >
          <MessageIcon />
        </div>
      </div>
    </div>
  );
};

export default User;
