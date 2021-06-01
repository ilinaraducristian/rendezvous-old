import {useState} from "react";
import ChannelArrowSVG from "../assets/channelArrowSVG.js";
import Channel from "./Channel.js";

function Group({name, children}) {

    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <li>
            <button onClick={() => setIsCollapsed(!isCollapsed)}>{name}</button>
            {
                isCollapsed ||
                <ul>
                    {children}
                </ul>
            }
        </li>
    );
}

export default Group;
