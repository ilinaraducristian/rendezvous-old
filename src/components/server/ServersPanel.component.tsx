import {useAppDispatch, useAppSelector} from "../../state-management/store";
import {
  selectServer as selectServerAction,
  selectServers,
  setOverlay as setOverlayAction
} from "../../state-management/slices/serversSlice";
import styled from "styled-components";
import ServerComponent from "./Server.component";
import Server from "../../types/Server";

function ServersPanelComponent() {
  const dispatch = useAppDispatch();
  const servers = useAppSelector(selectServers);

  function selectServer(server: Server) {
    dispatch(selectServerAction(server.id));
  }

  function setOverlay() {
    dispatch(setOverlayAction({type: "AddServerOverlayComponent"}));
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

/* CSS */

const Ol = styled.ol`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: var(--color-primary);
  width: 4.5em;
  overflow-y: auto;
  flex-shrink: 0;
`;

/* CSS */

export default ServersPanelComponent;