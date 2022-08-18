import React, { useState, useEffect } from "react";

// USE REDUX
import { useDispatch } from "react-redux";
import { userModel } from "../../slices/slices";

// STYLES
import "./App.scss";
import logo from "../../assets/login/logo.png";

// AXIOS
import { getData } from "../../config/axiosConfig";

// REDUX
import {
  deleteOutgoingFriendship,
  getUsersData,
  incomingFriendship,
  acceptOutgoingFriendshipRequest
} from "../../slices/slices";

// LIBRARIES
import Div100vh from "react-div-100vh";

// COMPONENTS
import Servers from "./components/Servers/Servers";
import User from "./components/User/User";
import UserContent from "./components/UserContent/UserContent";
import Chat from "./components/Chat/Chat";
let loaded = false;

const App = () => {
  // *** NEEDED ***
  // const navigate = useNavigate();
  // let loaded = false;
  //   const dispatch = useDispatch();
  //   const value = useSelector((state) => state.basic.value);
  // useEffect(() => {
  //   if (loaded) {
  //     return;
  //   }
  //   loaded = true;
  //   (async () => {
  //     const response = await getData("/friendships");
  //     if (response.status !== 200) {
  //       navigate("/login");
  //     }
  //   })();
  // }, []);
  const dispatch = useDispatch();

  //CONSTANTS USING HOOKS
  const [userContentType, setUserContentType] =
    useState("direct-message");
  const [nameClass, setNameClass] = useState("");

  // REQUEST CONSTANTS
  const getUserData = async () => {
    const response = await getData("/users/data");
    dispatch(userModel(response.data));
  };
  const getUsers = async () => {
    const response = await getData(`/users/data`);
    dispatch(getUsersData(response.data.users));
  };

  // HANDLE functions
  useEffect(() => {
    if (loaded) {
      return;
    }
    loaded = true;
    getUserData();
    const evtSource = new EventSource(
      "https://rendezvous-nest.herokuapp.com/users/sse",
      { withCredentials: true }
    );
    evtSource.addEventListener("friendRequest", (event) => {
      const request = JSON.parse(event.data);
      dispatch(
        incomingFriendship({
          id: request.friendshipId,
          userId: request.user.id,
          status: "pending",
        })
      );
      getUsers();
    });
    evtSource.addEventListener("friendshipDeleted", (event) => {
      const request = JSON.parse(event.data).id;
      dispatch(deleteOutgoingFriendship(request));
    });
    evtSource.addEventListener("friendRequestAccepted", (event) => {
      const request = JSON.parse(event.data).id;
      dispatch(acceptOutgoingFriendshipRequest(request));
    });
    // eslint-disable-next-line
  }, []);

  const handleUserAction = (action) => {
    switch (action) {
      case "profile":
        setUserContentType("profile");
        break;
      case "add-friend":
        setUserContentType("add-friend");
        break;
      case "friendships":
        setUserContentType("friendships");
        break;
      case "friendship-user":
        setNameClass("active");
        break;
      case "chat":
        setUserContentType("direct-message");
        setNameClass("");
        break;
      default:
        break;
    }
  };

  return (
    <Div100vh>
      <div className="app-container">
        <div className={`app-content ${nameClass}`}>
          <div className="user-Wrapper">
            <User onClick={handleUserAction} />
          </div>
          <div className="channels">
            <div className="servers">
              <Servers />
            </div>
            <div className="user-content">
              <UserContent
                content={userContentType}
                onClick={handleUserAction}
              />
            </div>
          </div>
        </div>
        <div className={`chat-container ${nameClass}`}>
          {nameClass === "active" ? (
            <Chat styleType={nameClass} onClick={handleUserAction} />
          ) : (
            <div className="app-logo-wrapper">
              <img src={logo} alt="app-logo" />
            </div>
          )}
        </div>
      </div>
    </Div100vh>
  );
};

export default App;
