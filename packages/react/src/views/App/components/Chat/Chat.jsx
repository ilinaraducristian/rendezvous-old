import React from "react";

// STYLES
import "./Chat.scss";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const Chat = ({ styleType = "", onClick = () => {} }) => {
  // PROPS

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <div className={`chat-container ${styleType}`}>
      <div className="chat-header">
        <KeyboardBackspaceIcon
          className="back-arrow"
          onClick={() => {
            onClick("chat");
          }}
        />
        <span>Gigel Mirel</span>
      </div>
      <div className="chat-message-wrapper">
        <textarea></textarea>
        <SendIcon className="send-message-icon"/>
      </div>
    </div>
  );
};

export default Chat;
