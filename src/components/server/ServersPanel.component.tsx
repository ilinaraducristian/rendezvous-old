import {Server} from "../../types";
import {useAppSelector} from "../../state-management/store";
import {selectServers, serversDataSlice} from "../../state-management/slices/serversDataSlice";
import styled from "styled-components";
import ServerComponent from "./Server.component";
import AddServerOverlayComponent from "../overlay/AddServerOverlayComponent";

const Ol = styled.ol`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: var(--color-primary);
  width: 4.5em;
  overflow-y: auto;
  flex-shrink: 0;
`;

function ServersPanelComponent() {

  const servers = useAppSelector(selectServers);

  function selectServer(server: Server) {
    serversDataSlice.actions.selectServer(server.id);
  }

  function setOverlay() {
    serversDataSlice.actions.setOverlay(<AddServerOverlayComponent/>);
  }

  return (
      <Ol className="list list__panel">
        {servers.map((server: Server) =>
            <ServerComponent key={`server_${server.id}`} name={server.name}
                             onSelectServer={() => selectServer(server)}
            />
        )}
        <ServerComponent name={"+"} onSelectServer={setOverlay}/>
      </Ol>
  );

}

export default ServersPanelComponent;