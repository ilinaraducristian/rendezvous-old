import {useCallback, useContext, useMemo, useState} from "react";
import {Server} from "../../types";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";
import CreateServerOverlayComponent from "./CreateServerOverlayComponent";
import JoinServerOverlayComponent from "./JoinServerOverlayComponent";

function AddServerOverlayComponent() {
  const Backend = useBackend();

  const [serverName, setServerName] = useState<string>("");
  const [invitation, setInvitation] = useState<string>("");
  const {dispatch} = useContext(GlobalStates);

  const addServer = useCallback((server: Server) => {
    // TODO check if this works
    dispatch({
      type: Actions.SERVERS_SET,
      payload: (oldServers: SortedMap<Server>) => oldServers.set(server.id, server).clone()
    });
  }, [dispatch]);

  const createServer = useCallback(() => {
    dispatch({type: Actions.OVERLAY_SET, payload: <CreateServerOverlayComponent/>});
  }, [dispatch]);

  const joinServer = useCallback(() => {
    dispatch({type: Actions.OVERLAY_SET, payload: <JoinServerOverlayComponent/>});
  }, [dispatch]);

  return useMemo(() =>
          <div className="overlay">
            <div className="overlay__container">
              <h1 className="h1">Add a server</h1>
              <div className="overlay__body">
                <button type="button" className="btn btn__overlay-select" onClick={createServer}>Create a server</button>
                <button type="button" className="btn btn__overlay-select" onClick={joinServer}>Join a server</button>
              </div>
              {/*<input type="text" onChange={e => setServerName(e.target.value)}/>*/}
              {/*<input type="text" onChange={e => setInvitation(e.target.value)}/>*/}
              {/*<button className="button" type="button" onClick={() => createServer(serverName, 0)}>*/}
              {/*  Create*/}
              {/*</button>*/}
              {/*<button className="button" type="button" onClick={() => joinServer(invitation)}>Join</button>*/}
            </div>
          </div>
      , [createServer, joinServer]);

}

export default AddServerOverlayComponent;