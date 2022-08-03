import React from "react";
import ReactDOM from "react-dom/client";
import "./utils/Styles/index.scss";

// LIBRARIES
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";

// COMPONENTS
import AppRoutes from "./config/AppRoutes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
