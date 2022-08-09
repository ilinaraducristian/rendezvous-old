import React from "react";

// STYLES
import "./UserContent.scss";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS
import Profile from "./components/Profile/Profile";
import AddFriend from "./components/AddFriend/AddFriend";
import Friendships from "./components/Friendships/Friendships";
import DirectMessage from "./components/DirectMessage/DirectMessage";

const UserContent = (props) => {
  // PROPS
  const { content = "", onClick = () => {} } = props;

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS
  switch (content) {
    case "direct-message":
      return <DirectMessage />;
    case "profile":
      return <Profile />;
    case "friendships":
      return <Friendships onClick={onClick} />;
    case "add-friend":
      return <AddFriend />;
    default:
      break;
  }
};

export default UserContent;
