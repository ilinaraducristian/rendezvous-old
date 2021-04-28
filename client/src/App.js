import React from 'react';
import Homepage from "./components/Homepage";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Chat from "./components/Chat";

function App() {

    return (
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
    );

}


export default App;

// add server icon
// <div>Icons made by <a href="https://www.flaticon.com/authors/dmitri13" title="dmitri13">dmitri13</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
// server placeholder icon
// <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
