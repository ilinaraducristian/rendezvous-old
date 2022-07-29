import React from "react";
import { Routes, Route } from "react-router-dom";

// COMPONENTS
import Main from "../../src/view/Main/Main";
import Authentication from "../../src/view/Authentication/Authentication";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Authentication />} />
      <Route path="/main" element={<Main />} />
    </Routes>
  );
};

export default AppRoutes;
