import React, { useState } from "react";

// STYLES
import "./AddFriend.scss";

// LIBRARIES

// AXIOS
import {
  postData,
  getData,
} from "../../../../../../config/axiosConfig";

// REDUX
import {
  addUser,
  addFriendship,
} from "../../../../../../slices/slices";
import { useDispatch } from "react-redux";

// COMPONENTS

const AddFriend = (props) => {
  // PROPS
  const { onClick = () => {} } = props;

  // CONSTANTS USING LIBRARIES
  const dispatch = useDispatch();

  // CONSTANTS USING HOOKS
  const [userId, setUserId] = useState("");
  const [showError, setShowError] = useState(false);

  // REQUEST API FUNCTIONS
  const addUsersData = async () => {
    const response = await getData(`/users/${userId}`);
    dispatch(addUser({ id: userId, name: response.data.name }));
  };

  const postRequest = async () => {
    const response = await postData("/friendships", { id: userId });
    console.log(response.data);
    if (response.status === 201) {
      // const friendshipRequestModel = {
      //   id: response.data.id,
      //   userId,
      //   status: "pending",
      //   incoming: false,
      // };
      dispatch(addFriendship(response.data));
      addUsersData();
      // dispatch(addUser(response.data.user));
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1000);
    }
  };

  return (
    <div className="addfriend-container">
      <div className="addfriend-text-wrapper">
        <span>Enter the friend ID</span>
      </div>
      <div className="addfriend-content">
        <input
          placeholder="Friend ID"
          onChange={(event) => {
            setUserId(event.target.value);
          }}
        />
        <div className="errorContainer">
          {showError && (
            <div className="errorMessageWrapper">
              <span>Wrong ID</span>
            </div>
          )}
        </div>
        <div className="addfriend-buttons-wrapper">
          <button
            className="request"
            onClick={() => {
              postRequest();
            }}
          >
            SEND REQUEST
          </button>
          <button
            className="close"
            onClick={() => {
              onClick("direct-message");
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
