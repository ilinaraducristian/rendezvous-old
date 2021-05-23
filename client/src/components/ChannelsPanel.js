import React, {useEffect, useState} from "react";
import Next from '../next.svg';
import MicrophoneSVG from "../assets/microphoneSVG.js";
import HeadphonesSVG from "../assets/headphonesSVG.js";
import SettingsSVG from "../assets/settingsSVG.js";
import Group from "./Group.js";
import Channel from "./Channel.js";

function ChannelsPanel(
    {
        serverName,
        groups,
        channels,
        onCreateChannel: createChannel,
        onCreateInvitation: createInvitation,
        onDeleteServer: deleteServer
    }
) {

    const [groupsAndChannels, setGroupsAndChannels] = useState([]);

    useEffect(() => {
        const elements = [];
        channels?.forEach((channel, key) => {
            elements.push(
                <Channel key={`channel_${key}`} channelKey={key} type={channel.type} channelName={channel.name}/>
            );
        });

        groups?.forEach((group, groupKey) => {
            elements.push(
                <Group key={`group_${groupKey}`} groupKey={groupKey} groupName={group.name} channels={group.channels}/>
            );
        });
        setGroupsAndChannels(elements);
    }, [groups, channels]);

    const [dropdown, setDropdown] = useState(false);
    // channels?.forEach((channel, id) => {
    //     elements.push(
    //         <li key={`channel_${id}`} className="channel" onClick={() => selectChannel(id)}>
    //             {channel.name}
    //         </li>
    //     );
    // });
    return (
        <div className="div--channels-panel">
            <button type="button" className="button--universal button--channels-header"
                    onClick={() => setDropdown(!dropdown)}>
                <span id="channels-header-servername">{serverName}</span>
            </button>
            {
                dropdown ?
                    <div id="server-options-dropdown">
                        <ul id="server-options-list">
                            <li onClick={() => {
                                createChannel();
                                setDropdown(false);
                            }}>Create channel
                            </li>
                            <li onClick={() => {
                                createInvitation();
                                setDropdown(false);
                            }}>Create invitation
                            </li>
                            <li onClick={() => {
                                deleteServer();
                                setDropdown(false);
                            }}>Delete server
                            </li>
                        </ul>
                    </div>
                    : null

            }

            <ul className="ul--channels-body">
                {groupsAndChannels}
            </ul>
            <div id="channels-footer">
                <img id="channels-footer-avatar" src={Next}/>
                <div id="channels-footer-username">
                    <div>Reydw</div>
                    <div>Status</div>
                </div>
                <button type="button">
                    <MicrophoneSVG muted={true}/>
                </button>
                <button type="button">
                    <HeadphonesSVG/>
                </button>
                <button type="button">
                    <SettingsSVG/>
                </button>
            </div>
        </div>
    );
}

export default ChannelsPanel;
