import React from "react";
import ReactDOM from "react-dom";
import "index.css";
import reportWebVitals from "reportWebVitals";
import AppComponent from "components/App/App.component";
import {store} from "state-management/store";
import {Provider} from "react-redux";
import {setOverlay} from "state-management/slices/data/data.slice";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./keycloak";
import ReactMediasoupProvider from "providers/ReactMediasoup.provider";
import ReactSocketIOProvider from "providers/ReactSocketIO.provider";

document.onkeyup = (event: any) => {
    if (event.code !== "Escape") return false;
    store.dispatch(setOverlay(null));
};

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ReactKeycloakProvider authClient={keycloak}>
                <ReactSocketIOProvider>
                    <ReactMediasoupProvider>
                        <AppComponent/>
                    </ReactMediasoupProvider>
                </ReactSocketIOProvider>
            </ReactKeycloakProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);


reportWebVitals();
