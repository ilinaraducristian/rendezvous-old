import React from "react";

// STYLES
import "./Profile.scss";
import userIcon from "../../../../../../assets/user/userIcon.png";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// LIBRARIES

// CONSTANTS & MOCKS
import { getUsersData } from "../Profile/helpers";

//AXIOS
import {
  deleteData,
  acceptFriendshipRequest,
} from "../../../../../../config/axiosConfig";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import {
  deleteIncomingFriendship,
  acceptIncomingFriendshipRequest,
} from "../../../../../../slices/slices";

// COMPONENTS

const Profile = () => {
  // PROPS

  // CONSTANTS USING LIBRARIES
  const userData = useSelector((state) => state.userData.user);
  const dispatch = useDispatch();

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS
  const deleteRequest = async (friendshipId) => {
    deleteData(`/friendships/${friendshipId}`);
    dispatch(deleteIncomingFriendship(friendshipId));
  };

  const acceptRequest = async (friendshipId) => {
    acceptFriendshipRequest(`/friendships/${friendshipId}/accept`);
  };

  // HANDLERS FUNCTIONS
  const handleAccept = (friendshipId) => {
    acceptRequest(friendshipId);
    dispatch(acceptIncomingFriendshipRequest(friendshipId));
  };

  return (
    <div className="profile-container">
      <div className="profile-container-pending-wrapper">
        <span>Pending request</span>
      </div>
      {userData?.friendships?.outgoing?.map((friendship, index) => {
        if (friendship.status === "pending") {
          const user = getUsersData(friendship.userId, userData);
          return (
            <div
              key={`user=${index}`}
              className="profile-pending-container"
            >
              <span>{user?.name} ...</span>
            </div>
          );
        } else {
          return null;
        }
      })}
      <div className="profile-friend-request-title-wrapper">
        <span>Friend request</span>
      </div>
      {userData?.friendships?.incoming?.map((friendship, index) => {
        if (friendship.status === "pending") {
          const user = getUsersData(friendship.userId, userData);
          return (
            <div
              key={`user-request-${index}`}
              className="profile-request"
            >
              <div className="request-user-wrapper">
                <img src={userIcon} alt="user request" />
                <span>{user?.name}</span>
              </div>
              <div className="profile-request-buttons-wrapper">
                <HowToRegIcon
                  onClick={() => {
                    handleAccept(friendship.id);
                  }}
                />
                <DeleteForeverIcon
                  onClick={() => {
                    deleteRequest(friendship.id);
                  }}
                />
              </div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default Profile;
