import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {ReactKeycloakProvider} from '@react-keycloak/web';
import keycloak from './keycloak';
import Loading from "./components/Loading";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Chat from "./components/Chat";
import Homepage from "./components/Homepage";

function onEvent(event) {
    console.log('keycloak event:');
    console.log(event);
}

ReactDOM.render(
    <React.StrictMode>
        <ReactKeycloakProvider
            authClient={keycloak}
            LoadingComponent={<Loading/>}
            onEvent={onEvent}
        >
            <BrowserRouter>
                <Switch>
                    <Route path="/chat">
                        <Chat/>
                    </Route>
                    <Route path="/">
                        <Homepage/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </ReactKeycloakProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
