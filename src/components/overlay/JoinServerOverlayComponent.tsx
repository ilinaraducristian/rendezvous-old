import {useCallback, useContext, useMemo, useRef} from "react";
import {GlobalStates} from "../../state-management/global-state";
import useBackend from "../../hooks/backend.hook";
import Actions from "../../state-management/actions";

function JoinServerOverlayComponent() {
  const Backend = useBackend();

  const {dispatch} = useContext(GlobalStates);
  const ref = useRef<HTMLInputElement>(null);

  const joinServer = useCallback(async () => {
    let response = await Backend.joinServer(ref.current?.value as string);
    dispatch({type: Actions.SERVER_ADDED, payload: response});
    dispatch({type: Actions.OVERLAY_SET, payload: null});
  }, [Backend, dispatch]);

  return useMemo(() =>
          <div className="overlay">
            <div className="overlay__container">
              <h1 className="h1">Join a server</h1>
              <div className="overlay__body">
                <input type="text" ref={ref}/>
                <button type="button" className="btn btn__overlay-select" onClick={joinServer}>Join
                </button>
              </div>
              {/*<input type="text" onChange={e => setServerName(e.target.value)}/>*/}
              {/*<button className="button" type="button" onClick={() => createServer(serverName, 0)}>*/}
              {/*  Create*/}
              {/*</button>*/}
              {/*<button className="button" type="button" onClick={() => joinServer(invitation)}>Join</button>*/}
            </div>
          </div>
      , [joinServer]);

}

export default JoinServerOverlayComponent;