import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getData from "../../config/axiosConfig";

// USE REDUX
// import { useSelector, useDispatch } from "react-redux";
// import { basicSlice } from "../slices/slices";

// STYLES
import styles from "./App.module.scss";
const App = () => {
  const navigate = useNavigate();
  //   const dispatch = useDispatch();
  //   const value = useSelector((state) => state.basic.value);
  useEffect(() => {
    getData("/user/data");
    // const test = (async) => {
    //   getData("/user/data");
    // }
    // console.log(test);
    // console.log(getData("/user/data"));
    // (async () => {
    //   const response = await fetch(process.env.REACT_APP_API_USER_DATA, { credentials: "include" });
    //   console.log(response.status);
    //   if (response.status !== 200) {
    //     navigate("/login");
    //   }
    //   // console.log(await response.json());
    //   console.log(await response.json());
    // })();
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "8rem",
        }}
        // onClick={() => dispatch(basicSlice(10))}
      >
        BALINT-TEMPLATE
      </h1>
    </div>
  );
};

export default App;
