import React from "react";
import ReactDOM from "react-dom";
import "index.css";
import reportWebVitals from "reportWebVitals";
import AppComponent from "components/app/App.component";
import {store} from "state-management/store";
import {Provider} from "react-redux";
import {hideSettings, setOverlay} from "./state-management/slices/data/data.slice";
import {selectIsSettingsShown} from "./state-management/selectors/data.selector";
import {ReactKeycloakProvider} from '@react-keycloak/web'
import keycloak from "./keycloak";

document.onkeyup = (event: any) => {
    if (event.code !== "Escape") return false;
    store.dispatch(setOverlay(null));
    const isSettingsShown = selectIsSettingsShown(store.getState());
    if (isSettingsShown) store.dispatch(hideSettings(undefined));
};

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ReactKeycloakProvider authClient={keycloak}>
                <AppComponent/>
            </ReactKeycloakProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);


reportWebVitals();
