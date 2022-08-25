import React, { useState, useEffect } from "react";

// STYLES
import "./Chat.scss";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// LIBRARIES

// CONSTANTS & MOCKS

// REDUX
import { useSelector, useDispatch } from "react-redux";
import {
  deleteFriendship,
  setConversation,
} from "../../../../slices/slices";
import {
  createMessages,
  addMessages,
} from "../../../../slices/messages";

// AXIOS
import {
  deleteData,
  postData,
  getData,
} from "../../../../config/axiosConfig";

// COMPONENTS

const Chat = ({
  styleType = "",
  onClick = () => {},
  userData = {},
}) => {
  // PROPS

  // CONSTANTS USING LIBRARIES
  const user = useSelector((state) => state.userData.user);
  const messages = useSelector(
    (state) => state.messagesData.messages
  );
  const dispatch = useDispatch();

  // CONSTANTS USING HOOKS
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = () => {
    deleteData(`/friendships/${userData.friendshipId}`);
    dispatch(deleteFriendship(userData.friendshipId));
  };

  const handleSendMessage = async () => {
    const response = await postData(
      `/friendships/${userData.friendshipId}/messages`,
      { text: message }
    );
    console.log(response.data);
    dispatch(addMessages(response.data));
    dispatch(setConversation(response.data));
  };

  const getMessages = async () => {
    const response = await getData(
      `/friendships/${userData.friendshipId}/messages?offset=0&limit=100`
    );
    dispatch(createMessages(response.data));
  };

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`chat-wrapper ${styleType}`}>
      <div className="chat-header">
        <div className="chat-header-info">
          <KeyboardBackspaceIcon
            className="back-arrow"
            onClick={() => {
              onClick("chat");
            }}
          />
          <span>{userData.name}</span>
        </div>
        <div className="chat-header-menu">
          <MoreVertIcon
            onClick={() => {
              setShowSettings(!showSettings);
            }}
          />
          {showSettings && (
            <div>
              <span
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete friend
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="chat-content">
        {messages.map((message, index) => (
          <div
            className={`message-wrapper-${
              message.userId === user.id ? "left" : "right"
            }`}
          >
            <span className="message">{message.text}</span>
            <span className="timestamp">
              {new Date(message.timestamp).toLocaleDateString(
                "en-US"
              )}
            </span>
          </div>
        ))}
      </div>
      <div className="chat-message-wrapper">
        <textarea
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        ></textarea>
        <SendIcon
          className="send-message-icon"
          onClick={() => {
            handleSendMessage();
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
