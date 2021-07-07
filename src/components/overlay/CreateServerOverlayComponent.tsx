import {useCallback, useContext, useMemo, useRef} from "react";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import {useKeycloak} from "@react-keycloak/web";

function CreateServerOverlayComponent() {

  const Backend = useBackend();
  const {dispatch} = useContext(GlobalStates);
  const ref = useRef<HTMLInputElement>(null);

  const createServer = useCallback(async () => {
    const serverName = ref.current?.value as string;
    const response = await Backend.createServer(serverName);
    dispatch({type: Actions.SERVER_ADDED, payload: response});
    dispatch({type: Actions.OVERLAY_SET, payload: null});
  }, [Backend, dispatch]);

  return useMemo(() =>
          <div className="overlay">
            <div className="overlay__container">
              <h1 className="h1">Create a server</h1>
              <div className="overlay__body">
                <input type="text" ref={ref}/>
                <button type="button" className="btn btn__overlay-select" onClick={createServer}>Create
                </button>
              </div>
              {/*<input type="text" onChange={e => setInvitation(e.target.value)}/>*/}
              {/*<button className="button" type="button" onClick={() => createServer(serverName, 0)}>*/}
              {/*  Create*/}
              {/*</button>*/}
              {/*<button className="button" type="button" onClick={() => joinServer(invitation)}>Join</button>*/}
            </div>
          </div>
      , [createServer]);

}

export default CreateServerOverlayComponent;