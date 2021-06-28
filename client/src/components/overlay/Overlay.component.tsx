import {useCallback, useContext, useState} from "react";
import {Server} from "../../types";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";

function OverlayComponent() {
  const Backend = useBackend();

  const [serverName, setServerName] = useState<string>("");
  const [invitation, setInvitation] = useState<string>("");
  const {dispatch} = useContext(GlobalStates);

  const addServer = useCallback((server: Server) => {
    // TODO check if this works
    dispatch({
      type: Actions.SERVERS_SET,
      payload: (oldServers: SortedMap<Server>) => new SortedMap<Server>(oldServers.set(server.id, server))
    });
  }, [dispatch]);

  async function createServer(serverName: string, order: number) {
    const server = await Backend.createServer(serverName, order);
    addServer(server);
  }

  async function joinServer(invitation: string) {
    const server = await Backend.joinServer(invitation);
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