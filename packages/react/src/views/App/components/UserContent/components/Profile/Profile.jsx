import React, { useEffect } from "react";

// STYLES
import "./Profile.scss";
import userIcon from "../../../../../../assets/user/userIcon.png";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

//AXIOS
import {
  deleteData,
  acceptFriendshipRequest,
} from "../../../../../../config/axiosConfig";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import {
  deleteFriendship,
  acceptFriendship,
} from "../../../../../../slices/slices";

const Profile = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData.user);
  const users = new Map(
    userData.users?.map((user) => [user.id, user])
  );

  const deleteRequest = async (friendshipId) => {
    dispatch(deleteFriendship(friendshipId));
    deleteData(`/friendships/${friendshipId}`);
  };

  const handleAccept = (friendshipId) => {
    dispatch(acceptFriendship(friendshipId));
    acceptFriendshipRequest(`/friendships/${friendshipId}/accept`);
  };

  return (
    <div className="profile-container">
      {userData?.friendships?.map((friendship, index) => {
        if (friendship.status === "pending") {
          return friendship.incoming ? (
            <>
              <div className="profile-container-pending-wrapper">
                <span>Friend request</span>
              </div>
              <div
                key={`user-request-${index}`}
                className="profile-request"
              >
                <div className="request-user-wrapper">
                  <img src={userIcon} alt="user request" />
                  <span>{users.get(friendship.userId)?.name}</span>
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
            </>
          ) : (
            <>
              <div className="profile-container-pending-wrapper">
                <span>Pending request</span>
              </div>
              <div
                key={`user=${index}`}
                className="profile-pending-container"
              >
                <span>{users.get(friendship.userId)?.name} ...</span>
              </div>
            </>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Profile;
