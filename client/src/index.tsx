import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import config from "./config";
import AppComponent from "./components/app/App.component";
import {IoProvider} from "socket.io-react-hook";

function onEvent(event: any) {

}

ReactDOM.render(
    <React.StrictMode>
      <ReactKeycloakProvider
          authClient={config.keycloakInstance}
          // LoadingComponent={<Loading/>}
          onEvent={onEvent}
      >
        <IoProvider>
          <AppComponent/>
        </IoProvider>
      </ReactKeycloakProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
