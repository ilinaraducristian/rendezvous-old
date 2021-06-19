import ServerComponent from "./Server.component";
import {Server} from "../../types";
import {useCallback} from "react";
import {GlobalContext} from "../app/App.component";
import OverlayComponent from "../overlay/Overlay.component";

function ServersPanelComponent() {

  const consumer = useCallback((
      {
        servers: [servers, setServers],
        overlay: [overlay, setOverlay],
        selectedServer: [selectedServer, setSelectedServer],
        selectedChannel: [selectedChannel, setSelectedChannel]
      }) => {

    function selectServer(server: Server) {
      setSelectedChannel(null);
      setSelectedServer(server);
    }

    return (
        <ol className="list servers-container">
          {servers.map((server: Server) =>
              <ServerComponent key={`server_${server.id}`} server={server} onSelectServer={() => selectServer(server)}/>
          )}
          <li>
            <button className="button" type="button" onClick={() => setOverlay(<OverlayComponent/>)}>
              Add server
            </button>
          </li>
        </ol>
    );

  }, []);

  return (
      <GlobalContext.Consumer>
        {consumer}
      </GlobalContext.Consumer>
  );
}

export default ServersPanelComponent;