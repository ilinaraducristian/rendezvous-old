import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// COMPONENTS
import App from "../views/App/App";
import Login from "../views/Login/Login";

// FUNCTIONS
import enableElementsOutline from "../helpers/globalConfig";

const AppRoutes = () => {
  // HANDLE FUNCTIONS
  useEffect(() => {
    enableElementsOutline(false);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<App />} />
    </Routes>
  );
};

export default AppRoutes;
