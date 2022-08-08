import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getData } from "../../config/axiosConfig";

// USE REDUX
// import { useSelector, useDispatch } from "react-redux";
// import { basicSlice } from "../slices/slices";

// STYLES
import "./App.scss";

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
  const [device, setDevice] = useState("");

  return (
    <Div100vh>
      <div className="app-container">
        <div className="app-content">
          <div className="user-Wrapper">
            <User />
          </div>
          <div className="channels">
            <div className="servers">
              <Servers />
            </div>
            <div className="user-content">
              <UserContent />
            </div>
          </div>
        </div>
        <div className="chat-container">
          <Chat />
        </div>
      </div>
    </Div100vh>
  );
};

export default App;
