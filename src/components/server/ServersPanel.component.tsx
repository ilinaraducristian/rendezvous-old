import {useAppDispatch, useAppSelector} from "state-management/store";
import {
  selectServer as selectServerAction,
  setOverlay as setOverlayAction
} from "state-management/slices/data/data.slice";
import styled from "styled-components";
import ServerComponent from "components/server/Server.component";
import Server from "types/Server";
import {selectServers} from "state-management/selectors/data.selector";

function ServersPanelComponent() {
  const dispatch = useAppDispatch();
  const servers = useAppSelector(selectServers);

  function selectServer(server: Server) {
    dispatch(selectServerAction(server.id));
  }

  function showAddServerOverlay() {
    dispatch(setOverlayAction({type: "AddServerOverlayComponent"}));
  }

  function goHome() {
    dispatch(selectServerAction(null));
  }

  return (
      <Ol className="list list__panel">
        <ServerComponent name={"Home"} onSelectServer={goHome}/>
        {servers.map((server: Server) =>
            <ServerComponent key={`server_${server.id}`} name={server.name}
                             onSelectServer={() => selectServer(server)}
            />
        )}
        <ServerComponent name={"+"} onSelectServer={showAddServerOverlay}/>
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