import React, {useState} from "react";

function AddServerOverlay({onCreateServer: createServer, onJoinServer: joinServer}) {

    const [serverName, setServerName] = useState('');
    const [invitationCode, setInvitationCode] = useState('');

    function handleServernameChange(event) {
        setServerName(event.target.value);
    }

    function handleInvitationcodeChange(event) {
        setInvitationCode(event.target.value);
    }

    return (
        <form key="add_server_overlay" className="overlay-content-container overlay-content-add-server">
            <label style={{gridColumn: "1 / span 2"}} htmlFor="servername">New server name:</label>
            <input style={{gridColumn: "1 / span 2"}} type="text" name="servername" id="servername" value={serverName}
                   onChange={handleServernameChange}/>
            <label style={{gridColumn: "1 / span 2"}} htmlFor="invitationcode">Invitation code:</label>
            <input style={{gridColumn: "1 / span 2"}} type="text" name="invitationcode" id="invitationcode"
                   value={invitationCode}
                   onChange={handleInvitationcodeChange}/>
            <button style={{gridColumn: "1"}} type="button" id="createserver"
                    onClick={() => createServer(serverName)}>Create server
            </button>
            <button style={{gridColumn: "2"}} type="button" id="createserver"
                    onClick={() => joinServer(invitationCode)}>Join server
            </button>
        </form>
    );
}

export default AddServerOverlay;
