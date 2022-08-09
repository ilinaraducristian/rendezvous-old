import React from "react";

// STYLES
import "./Friendships.scss";
import userIcon from "../../../../../../assets/user/userIcon.png";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const Friendships = (props) => {
  // PROPS
  const { onClick = () => {} } = props;
  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS
  const usersModel = [
    {
      name: "Gigle Mirel",
      lastMessage: "Esti jmeker cel mai tare ",
    },
    {
      name: "Ion Marcel",
      lastMessage: "Cumpara paine saraqie ",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
    {
      name: "Alex Marcel",
      lastMessage: "Nu am mai vz asa viata...",
    },
  ];

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <div className="friendships-container">
      <div className="search-container">
        <input placeholder="🔍 Search" />
      </div>
      <div className="friendships-content">
        {usersModel?.map((user, index) => (
          <div
            key={`user-${index}`}
            className="user-wrapper"
            onClick={() => {
              onClick("direct-message");
            }}
          >
            <div className="user-avatar-wrapper">
              <img src={userIcon} alt="user icon" />
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friendships;
