import {useCallback, useContext, useState} from "react";
import {Server} from "../../types";
import {GlobalStates} from "../app/App.component";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";

function OverlayComponent() {

  const {createServer: apiCreateServer, joinServer: apiJoinServer} = useBackend();

  const [serverName, setServerName] = useState<string>("");
  const [invitation, setInvitation] = useState<string>("");
  const context = useContext(GlobalStates);

  const addServer = useCallback((server: Server) => {
    // TODO check if this works
    context.dispatch({
      type: "SERVERS_SET", payload: (oldServers: SortedMap<Server>) => {
        oldServers.set(server.id, server);
        return oldServers;
      }
    });
  }, [context]);

  async function createServer(serverName: string, order: number) {
    const server = await apiCreateServer(serverName, order);
    addServer(server);
  }

  async function joinServer(invitation: string) {
    const server = await apiJoinServer(invitation);
    addServer(server);
  }

  return (
      <div>
        <input type="text" onChange={e => setServerName(e.target.value)}/>
        <input type="text" onChange={e => setInvitation(e.target.value)}/>
        <button className="button" type="button" onClick={() => createServer(serverName, 0)}>
          Create
        </button>
        <button className="button" type="button" onClick={() => joinServer(invitation)}>Join</button>
      </div>
  );

}

export default OverlayComponent;