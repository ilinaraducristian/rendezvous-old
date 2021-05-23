import ChannelSVG from "../assets/channelSVG.js";
import {useContext} from "react";
import {ChannelsPanelContext} from "../contexts.js";

function Channel({groupKey, channelKey, channelName, type: channelType}) {

    const {onChannelSelect: selectChannel} = useContext(ChannelsPanelContext);


    // <li key={groupKey ? `group_${groupKey}_${channelKey}` : `channel_${channelKey}`} className="li--tc">
    return (
        <li className="li--tc">
            <button type="button" className="button--universal" onClick={() => selectChannel(groupKey, channelKey)}>
                {
                    channelType === 'text' ?
                        <ChannelSVG private={false} className="tc-icon"/>
                        :
                        null
                }
                <span className="span--channel-name">{channelName}</span>
            </button>
        </li>
    );

}

export default Channel;
