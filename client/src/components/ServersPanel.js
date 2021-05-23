import React from "react";
import AddServerSVG from "../assets/addServerSVG.js";

function ServersPanel({servers, onSelectServer: selectServer, onAddServer: addServer}) {
    return (
        <ul className="ul--servers-panel">
            {
                servers.map(server =>
                    <li key={`server_${server.id}`} className="li--server-icon" onClick={() => selectServer(server.id)}>
                        <button className="button--universal">{server.name[0]}</button>
                    </li>
                )
            }
            <li className="li--server-icon" onClick={addServer}>
                <AddServerSVG/>
            </li>
        </ul>
    );
}

export default ServersPanel;
