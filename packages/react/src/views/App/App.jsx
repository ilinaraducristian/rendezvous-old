import React from "react";

// USE REDUX
// import { useSelector, useDispatch } from "react-redux";
// import { basicSlice } from "../slices/slices";

// STYLES
import styles from "./App.module.scss";

const App = () => {
  //   const dispatch = useDispatch();
  //   const value = useSelector((state) => state.basic.value);
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
