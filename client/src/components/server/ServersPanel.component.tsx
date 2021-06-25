import ServerComponent from "./Server.component";
import {Server} from "../../types";
import {useCallback, useContext, useMemo} from "react";
import {GlobalStates} from "../app/App.component";
import OverlayComponent from "../overlay/Overlay.component";

function ServersPanelComponent() {

  const {state, dispatch} = useContext(GlobalStates);

  const selectServer = useCallback((server: Server) => {
    dispatch({type: "CHANNEL_SELECTED", payload: null});
    dispatch({type: "SERVER_SELECTED", payload: server});
  }, [dispatch]);

  const setOverlay = useCallback(() => {
    dispatch({type: "OVERLAY_SET", payload: <OverlayComponent/>});
  }, [dispatch]);

  return useMemo(() => (
      <ol className="list list__panel list__servers-panel">
        {state.servers.map((server: Server) =>
            <ServerComponent key={`server_${server.id}`} server={server}
                             onSelectServer={() => selectServer(server)}/>
        )}
        <li className="li li__server">
          <button className="btn btn__server" type="button" onClick={setOverlay}>
            +
          </button>
        </li>
      </ol>
  ), [selectServer, setOverlay, state.servers]);


}

export default ServersPanelComponent;