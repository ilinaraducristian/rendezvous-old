import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../../config/axiosConfig";

// USE REDUX
// import { useSelector, useDispatch } from "react-redux";
// import { basicSlice } from "../slices/slices";

// STYLES
import "./App.scss";

const App = () => {
  const navigate = useNavigate();
  let loaded = false;
  //   const dispatch = useDispatch();
  //   const value = useSelector((state) => state.basic.value);
  useEffect(() => {
    if (loaded) {
      return;
    }
    loaded = true;
    (async () => {
      const response = await getData("/friendships");
      if (response.status !== 200) {
        navigate("/login");
      }
    })();
  }, []);
  return (
    <div className="app-container">
      
    </div>
  );
};

export default App;
