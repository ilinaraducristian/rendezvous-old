import React from "react";

// STYLES
import "./Friendships.scss";
import userIcon from "../../../../../../assets/user/userIcon.png";

// LIBRARIES

// REDUX
import { useSelector } from "react-redux";

// COMPONENTS

const Friendships = (props) => {
  // PROPS
  const { onClick = () => {} } = props;

  // CONSTANTS USING LIBRARIES
  const userData = useSelector((state) => state.userData.user);
  const users = new Map(
    userData.users.map((user) => [user.id, user])
  );

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <div className="friendships-container">
      <div className="search-container">
        <input placeholder="🔍 Search" />
      </div>
      <div className="friendships-content">
        {userData?.friendships?.map((friendship, index) => {
          if (friendship.status === "accepted") {
            return (
              <div
                key={`user-${index}`}
                className="user-wrapper"
                onClick={() => {
                  onClick("friendship-user", {
                    friendshipId: friendship.id,
                    name: users.get(friendship.userId)?.name,
                  });
                }}
              >
                <div className="user-avatar-wrapper">
                  <img src={userIcon} alt="user icon" />
                </div>
                <div className="user-info">
                  <span className="user-name">
                    {users.get(friendship.userId)?.name}
                  </span>
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
