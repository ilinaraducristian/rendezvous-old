import React, { useState, useEffect } from "react";

// STYLES
import "./Friendships.scss";
import userIcon from "../../../../../../assets/user/userIcon.png";

// LIBRARIES

// CONSTANTS & MOCKS
import { getUsersData } from "./helpers";

// AXIOS
import { getData } from "../../../../../../config/axiosConfig";

// REDUX

// COMPONENTS

const Friendships = (props) => {
  // PROPS
  const { onClick = () => {} } = props;

  // CONSTANTS USING LIBRARIES

  // CONSTANTS USING HOOKS
  const [friendships, setFriendships] = useState([]);
  const [users, setUsers] = useState([]);

  const getFriendships = async () => {
    const response = await getData("/friendships");
    setFriendships([
      ...response.data.friendships.incoming,
      ...response.data.friendships.outgoing,
    ]);
  };

  const getUsers = async () => {
    const response = await getData(`/users/data`);
    setUsers(response.data.users);
  };

  // USE EFFECT FUNCTION
  useEffect(() => {
    getFriendships();
    getUsers();
  }, []);

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <div className="friendships-container">
      <div className="search-container">
        <input placeholder="🔍 Search" />
      </div>
      <div className="friendships-content">
        {friendships?.map((user, index) => {
          if (user.status === "accepted") {
            const userInfo = getUsersData(user.userId, users);
            return (
              <div
                key={`user-${index}`}
                className="user-wrapper"
                onClick={() => {
                  onClick("friendship-user");
                }}
              >
                <div className="user-avatar-wrapper">
                  <img src={userIcon} alt="user icon" />
                </div>
                <div className="user-info">
                  <span className="user-name">{userInfo?.name}</span>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default Friendships;
