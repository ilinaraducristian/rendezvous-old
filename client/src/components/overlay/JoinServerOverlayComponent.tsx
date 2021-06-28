import {useCallback, useContext, useMemo, useState} from "react";
import {Server} from "../../types";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";

function JoinServerOverlayComponent() {
  const Backend = useBackend();

  const [invitation, setInvitation] = useState<string>("");
  const {dispatch} = useContext(GlobalStates);

  const joinServer = useCallback(async (invitation: string) => {
    const server = await Backend.joinServer(invitation);
    dispatch({
      type: Actions.SERVERS_SET,
      payload: (oldServers: SortedMap<Server>) => new SortedMap<Server>(oldServers.set(server.id, server))
    });
    dispatch({type: Actions.OVERLAY_SET, payload: null});
  }, [Backend, dispatch]);

  return useMemo(() =>
          <div className="overlay">
            <div className="overlay__container">
              <h1 className="h1">Join a server</h1>
              <div className="overlay__body">
                <input type="text" onChange={e => setInvitation(e.target.value)}/>
                <button type="button" className="btn btn__overlay-select" onClick={() => joinServer(invitation)}>Join
                </button>
              </div>
              {/*<input type="text" onChange={e => setServerName(e.target.value)}/>*/}
              {/*<button className="button" type="button" onClick={() => createServer(serverName, 0)}>*/}
              {/*  Create*/}
              {/*</button>*/}
              {/*<button className="button" type="button" onClick={() => joinServer(invitation)}>Join</button>*/}
            </div>
          </div>
      , [invitation, joinServer]);

}

export default JoinServerOverlayComponent;