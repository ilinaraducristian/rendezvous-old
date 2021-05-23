import {useState} from "react";
import ChannelArrowSVG from "../assets/channelArrowSVG.js";
import Channel from "./Channel.js";

function Group({groupKey, groupName, channels}) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const elements = [];
    channels.forEach((channel, channelKey) => {
        elements.push(
            <Channel key={`group_${groupKey}_${channelKey}`} groupKey={groupKey} channelKey={channelKey}
                     type={channel.type} channelName={channel.name}/>
        );
    });
    // <li key={`group_${groupKey}`} className="li--group">
    return (
        <li className="li--group">
            <button type="button" className="button--universal"
                    onClick={() => {
                        setIsCollapsed(!isCollapsed);
                    }}>
                <ChannelArrowSVG tilted={isCollapsed}/>
                <span className="channels-group-name">{groupName}</span>
            </button>
            {
                !isCollapsed &&
                <ul className="groups-list">
                    {elements}
                </ul>
            }
        </li>
    );
}

export default Group;
