import {useCallback, useState} from "react";
import {Server} from "../../types";
import {GlobalContext} from "../app/App.component";
import useBackend from "../../hooks/backend.hook";

function OverlayComponent() {

  const {createServer: apiCreateServer, joinServer: apiJoinServer} = useBackend();

  const [serverName, setServerName] = useState<string>("");
  const [invitation, setInvitation] = useState<string>("");

  const consumer = useCallback((
      {
        servers: [servers, setServers]
      }
  ) => {

    function addServer(server: Server) {
      // TODO check if this works
      setServers((oldServers: Server[]) => {
        oldServers.push(server);
        return oldServers;
      });
    }

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

  }, [apiCreateServer, apiJoinServer, invitation, serverName]);

  return (
      <GlobalContext.Consumer>
        {consumer}
      </GlobalContext.Consumer>
  );
}

export default OverlayComponent;