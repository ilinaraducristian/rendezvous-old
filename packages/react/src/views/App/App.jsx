import React, { useState } from "react";

// USE REDUX
// import { useSelector, useDispatch } from "react-redux";
// import { basicSlice } from "../slices/slices";

// STYLES
import "./App.scss";
import logo from "../../assets/login/logo.png";

// LIBRARIES
import Div100vh from "react-div-100vh";

// COMPONENTS
import Servers from "./components/Servers/Servers";
import User from "./components/User/User";
import UserContent from "./components/UserContent/UserContent";
import Chat from "./components/Chat/Chat";

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

  //CONSTANTS USING HOOKS
  const [userContentType, setUserContentType] = useState("direct-message");
  const [nameClass, setNameClass] = useState("");

  // GENERAL CONSTANTS

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
      default:
        break;
    }
  };

  return (
    <Div100vh>
      <div className="app-container">
        <div className={`app-content ${nameClass}`}>
          <div className={`user-Wrapper ${nameClass}`}>
            <User onClick={handleUserAction} />
          </div>
          <div className={`channels ${nameClass}`}>
            <div className="servers">
              <Servers />
            </div>
            <div className="user-content">
              <UserContent content={userContentType} onClick={handleUserAction} />
            </div>
          </div>
        </div>
        <div className={`chat-container ${nameClass}`}>
          {nameClass === "active" ? (
            <Chat />
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
