import {useCallback, useContext, useRef} from "react";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import {Server} from "../../types";
import config from "../../config";

function CreateGroupOverlayComponent() {

  const Backend = useBackend();
  const {state, dispatch} = useContext(GlobalStates);
  const ref = useRef<HTMLInputElement>(null);

  const createGroup = useCallback(async () => {
    if (!config.offline) {
      const groupName = ref.current?.value as string;
      const selectedServer = state.selectedServer as Server;
      const groupId = await Backend.createGroup(selectedServer.id, groupName);
      dispatch({
        type: Actions.GROUP_ADDED, payload: {
          id: groupId,
          serverId: selectedServer.id,
          name: groupName
        }
      });
    }
    dispatch({type: Actions.OVERLAY_SET, payload: null});
  }, []);

  return (
      <div className="overlay">
        <div className="overlay__container">
          <h1 className="h1">Group name</h1>
          <input type="text" ref={ref}/>
          <button type="button" className="btn btn__overlay-select" onClick={createGroup}>Create
          </button>
        </div>
      </div>
  );
}

export default CreateGroupOverlayComponent;