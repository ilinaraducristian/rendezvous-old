import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {ReactKeycloakProvider} from '@react-keycloak/web';
import keycloak from './keycloak';
import {BrowserRouter, Switch} from "react-router-dom";
import routes from "./routes.js";
import {SortedMap} from "./SortedMap.js";

function onEvent(event) {
    // console.log('keycloak event:');
    console.log(event);
}

ReactDOM.render(
    <React.StrictMode>
        <ReactKeycloakProvider
            authClient={keycloak}
            // LoadingComponent={<Loading/>}
            onEvent={onEvent}
        >
            <BrowserRouter>
                <Switch>
                    {routes}
                </Switch>
            </BrowserRouter>
        </ReactKeycloakProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();

// <div>Icons made by <a href="" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
