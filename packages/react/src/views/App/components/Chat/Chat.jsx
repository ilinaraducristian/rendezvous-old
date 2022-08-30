import React, { useState, useEffect } from "react";

// STYLES
import "./Chat.scss";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
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
  deleteMessage,
  updateMessage,
} from "../../../../slices/messages";

// AXIOS
import {
  deleteData,
  postData,
  getData,
  updateMessageRequest,
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
  const [showEditMessage, setShowEditMessage] = useState(false);
  const [currentInfoMessage, setCurrentInfoMessage] = useState(-1);
  const [currentEditMessage, setCurrentEditMessage] = useState(-1);
  const [editableMessage, setEditableMessage] = useState("");

  const handleDelete = () => {
    deleteData(`/friendships/${userData.friendshipId}`);
    dispatch(deleteFriendship(userData.friendshipId));
  };

  const handleSendMessage = async () => {
    if (message !== "") {
      const response = await postData(
        `/friendships/${userData.friendshipId}/messages`,
        { text: message }
      );
      dispatch(addMessages(response.data));
      dispatch(setConversation(response.data));
      setMessage("");
    }
  };

  const getMessages = async () => {
    const response = await getData(
      `/friendships/${userData.friendshipId}/messages?offset=0&limit=100`
    );
    if (response.status !== 400) {
      dispatch(createMessages(response.data));
    }
  };

  const handleDeleteMessage = async (message) => {
    deleteData(
      `/friendships/${message.friendshipId}/messages/${message.id}`
    );
    dispatch(deleteMessage(message.id));
    setShowEditMessage(!showEditMessage);
  };

  const handleEditMessage = async (message, newText) => {
    updateMessageRequest(
      `/friendships/${message.friendshipId}/messages/${message.id}`,
      newText
    );
    dispatch(updateMessage({ message, newText }));
  };

  const timeMessage = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
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
        {messages?.map((message, index) => (
          <div
            key={`message-${index}`}
            className={`message-wrapper-${
              message.userId === user.id ? "right" : "left"
            }`}
          >
            <div className="messageContainer">
              <div className="message">
                <span className="message-time">
                  {timeMessage(message.timestamp)}
                </span>
                {currentEditMessage === index ? (
                  <input
                    type="text"
                    value={editableMessage}
                    onChange={(event) => {
                      setEditableMessage(event.target.value);
                    }}
                  />
                ) : (
                  <span className="message-text">{message.text}</span>
                )}

                <div className="message-edit">
                  {message.userId === user.id &&
                    (currentEditMessage !== index ? (
                      <MoreVertIcon
                        onClick={() => {
                          setShowEditMessage(!showEditMessage);
                          setCurrentInfoMessage(index);
                        }}
                      />
                    ) : (
                      <div className="edit-buttons">
                        <CheckIcon
                          onClick={() => {
                            if (editableMessage !== message.text) {
                              handleEditMessage(
                                message,
                                editableMessage
                              );
                            }
                            setCurrentEditMessage(-1);
                          }}
                        />
                        <CancelIcon
                          onClick={() => {
                            setShowEditMessage(false);
                            setCurrentEditMessage(-1);
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {showEditMessage && currentInfoMessage === index && (
                <div className="message-edit-info">
                  <span
                    onClick={() => {
                      setShowEditMessage(false);
                      setCurrentEditMessage(index);
                      setEditableMessage(message.text);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    onClick={() => {
                      handleDeleteMessage(message);
                    }}
                  >
                    Delete
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-message-wrapper">
        <textarea
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSendMessage();
            }
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
