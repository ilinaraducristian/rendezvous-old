import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import friendshipsState from "./state/friendships-state";
import { rootState } from "./state/root-state";
import serversState from "./state/servers-state";

ReactDOM.render(
  <React.StrictMode>
    <App rootState={rootState} serversState={serversState} friendshipsState={friendshipsState} />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();