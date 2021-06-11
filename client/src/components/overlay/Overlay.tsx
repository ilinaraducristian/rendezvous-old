import {useState} from "react";

function Overlay({
                   onJoinServer: joinServer,
                   onCreateServer: createServer
                 }: { onJoinServer: Function, onCreateServer: Function }) {

  const [invitation, setInvitation] = useState("");
  const [serverName, setServerName] = useState("");

  return (
      <div className="overlay">
        <div className="container">
          <h4>Enter invitation or create a new server</h4>
          <form>
            <label htmlFor="invitation">Invitation link:</label>
            <input type="text" name="invitation" onChange={e => setInvitation(e.target.value)}/>
            <label htmlFor="server-name">Server name:</label>
            <input type="text" name="server-name" onChange={e => setServerName(e.target.value)}/>
            <button type="button" onClick={() => joinServer(invitation)}>Join server</button>
            <button type="button" onClick={() => createServer(serverName)}>Create server</button>
          </form>
        </div>
      </div>
  );
}

export default Overlay;
