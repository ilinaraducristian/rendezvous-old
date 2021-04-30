import {Route} from "react-router-dom";
import Chat from "./components/Chat.js";
import Homepage from "./components/Homepage.js";

const routes = [
    <Route path="/chat" key={"path_chat"}>
        <Chat/>
    </Route>,
    <Route path="/" key={"path_home"}>
        <Homepage/>
    </Route>
];

export default routes;
