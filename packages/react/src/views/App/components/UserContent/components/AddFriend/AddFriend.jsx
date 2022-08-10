import React from "react";

// STYLES
import "./AddFriend.scss";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const AddFriend = (props) => {
  // PROPS
  const { onClick = () => {} } = props;
  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <div className="addfriend-container">
      <div className="addfriend-text-wrapper">
        <span>Enter the friend ID</span>
      </div>
      <div className="addfriend-content">
        <input placeholder="Friend ID" />
        <div className="addfriend-buttons-wrapper">
          <button className="request">SEND REQUEST</button>
          <button className="close" onClick = {() => {onClick("direct-message")}}>CLOSE</button>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
