import ChannelSVG from "../assets/channelSVG.js";
import {useContext} from "react";
import {ChannelsPanelContext} from "../contexts.js";

function Channel({id, name, onChannelSelect: selectChannel}) {

    return (
        <li>
            <button onClick={() => selectChannel(id)}>{name}</button>
        </li>
    );

}

export default Channel;
