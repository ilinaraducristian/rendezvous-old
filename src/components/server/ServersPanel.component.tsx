import ServerComponent from "./Server.component";
import {Server} from "../../types";
import {useCallback, useContext, useMemo} from "react";
import {GlobalStates} from "../../state-management/global-state";
import AddServerOverlayComponent from "../overlay/AddServerOverlayComponent";
import Actions from "../../state-management/actions";

function ServersPanelComponent() {

  const {state, dispatch} = useContext(GlobalStates);

  const selectServer = useCallback((server: Server) => {
    dispatch({type: Actions.CHANNEL_SELECTED, payload: null});
    dispatch({type: Actions.SERVER_SELECTED, payload: server.id});
  }, [dispatch]);

  const setOverlay = useCallback(() => {
    dispatch({type: Actions.OVERLAY_SET, payload: <AddServerOverlayComponent/>});
  }, [dispatch]);

  return useMemo(() =>
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
      , [selectServer, setOverlay, state.servers]);


}

export default ServersPanelComponent;