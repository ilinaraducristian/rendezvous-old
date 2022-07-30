import React from "react";
import { Routes, Route } from "react-router-dom";

// COMPONENTS
import Main from "../view/App/App";
import Authentication from "../../src/view/Authentication/Authentication";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Authentication path="WELCOME" />} />
      <Route path="/login" element={<Authentication path="LOGIN" />} />
      <Route path="/register" element={<Authentication path="REGISTER" />} />
      <Route path="/app" element={<Main />} />
    </Routes>
  );
};

export default AppRoutes;
