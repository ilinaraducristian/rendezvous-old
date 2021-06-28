import {useCallback, useContext, useMemo, useState} from "react";
import {Server} from "../../types";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";

function CreateServerOverlayComponent() {
  const Backend = useBackend();

  const [serverName, setServerName] = useState<string>("");
  const {dispatch} = useContext(GlobalStates);

  const createServer = useCallback(async (serverName: string) => {
    const server = await Backend.createServer(serverName, 0);
    dispatch({
      type: Actions.SERVERS_SET,
      payload: (oldServers: SortedMap<Server>) => new SortedMap<Server>(oldServers.set(server.id, server))
    });
    dispatch({type: Actions.OVERLAY_SET, payload: null});
  }, [Backend, dispatch]);

  return useMemo(() =>
          <div className="overlay">
            <div className="overlay__container">
              <h1 className="h1">Create a server</h1>
              <div className="overlay__body">
                <input type="text" onChange={e => setServerName(e.target.value)}/>
                <button type="button" className="btn btn__overlay-select" onClick={() => createServer(serverName)}>Create
                </button>
              </div>
              {/*<input type="text" onChange={e => setInvitation(e.target.value)}/>*/}
              {/*<button className="button" type="button" onClick={() => createServer(serverName, 0)}>*/}
              {/*  Create*/}
              {/*</button>*/}
              {/*<button className="button" type="button" onClick={() => joinServer(invitation)}>Join</button>*/}
            </div>
          </div>
      , [createServer, serverName]);

}

export default CreateServerOverlayComponent;