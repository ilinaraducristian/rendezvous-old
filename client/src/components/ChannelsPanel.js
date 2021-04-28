import React, {useState} from "react";

function ChannelsPanel(
    {
        channels,
        serverName,
        onSelectChannel: selectChannel,
        onCreateChannel: createChannel,
        onCreateInvitation: createInvitation,
        onDeleteServer: deleteServer
    }
) {
    const elements = [];
    const [dropdown, setDropdown] = useState(false);
    channels?.forEach((channel, id) => {
        elements.push(
            <li key={`channel_${id}`} className="channel" onClick={() => selectChannel(id)}>
                {channel.name}
            </li>
        );
    });
    return (
        <div className="channels-container">
            <button type="button" className="server-options-button transparent-button"
                    onClick={() => setDropdown(!dropdown)}>
                {serverName}
            </button>
            {
                dropdown ?
                    <div className="server-options-dropdown">
                        <ul className="server-options">
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

            <ul className="channels-list">
                {elements}
            </ul>
        </div>
    );
}

export default ChannelsPanel;
