import AddIcon from "../add.svg";
import React from "react";
import ServerPlaceholderIcon from "../server-placeholder-icon.svg";

function ServersPanel({servers, onSelectServer: selectServer, onAddServer: addServer}) {
    const elements = [];
    servers?.forEach((server, key) =>
        elements.push(<li key={`server_${key}`}>
            <img
                src={server.icon || ServerPlaceholderIcon}
                alt={server.name}
                title={server.name}
                className="server-icon"
                onClick={() => selectServer(key)}
            />
        </li>)
    );
    return (
        <ul className="servers" id="servers">
            {elements}
            <li>
                <img src={AddIcon} onClick={addServer} alt="Add server" className="server-icon"/>
            </li>
        </ul>
    );
}

export default ServersPanel;
