import React from "react";

// STYLES
import "./DirectMessage.scss";
import userIcon from "../../../../../../assets/user/userIcon.png";
// LIBRARIES

// CONSTANTS & MOCKS

// REDUX
import { useSelector } from "react-redux";

// COMPONENTS

const DirectMessage = ({ onClick = () => {} }) => {
  // PROPS

  // CONSTANTS USING LIBRARIES
  const user = useSelector((state) => state.userData.user);
  const users = new Map(user.users?.map((user) => [user.id, user]));
  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <div className="direct-message-container">
      {user?.conversations?.map((user, index) => (
        <div
          className="user-conversation-wrapper"
          key={`user-${index}`}
          onClick={() => {
            onClick("direct-message", {
              friendshipId: user.friendshipId,
              name: users.get(user.userId)?.name,
            });
          }}
        >
          <img src={userIcon} alt="user icon" />
          <div className="user-conversation-info">
            <span className="user-name">
              {users.get(user.userId)?.name}
            </span>
            <span className="user-text">{user.text}</span>
          </div>
          <span className="user-date">
            {new Date(user.timestamp).toLocaleDateString("en-US")}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DirectMessage;
