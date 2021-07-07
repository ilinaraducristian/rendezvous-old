import {useCallback, useContext, useRef} from "react";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import {ChannelType, Server} from "../../types";
import config from "../../config";

function CreateChannelOverlay() {

  const Backend = useBackend();
  const {state, dispatch} = useContext(GlobalStates);
  const ref = useRef<HTMLInputElement>(null);

  const createChannel = useCallback(async () => {
    if (!config.offline) {
      const channelName = ref.current?.value as string;
      const selectedServer = state.selectedServer as Server;
      const channelId = await Backend.createChannel(selectedServer.id, channelName);
      const channel = {
        id: channelId,
        serverId: selectedServer.id,
        groupId: null,
        type: ChannelType.Text,
        name: channelName
      };
      dispatch({type: Actions.CHANNEL_ADDED, payload: channel});
      dispatch({type: Actions.CHANNEL_SELECTED, payload: channel});
    }
    dispatch({type: Actions.OVERLAY_SET, payload: null});
  }, []);

  return (
      <div className="overlay">
        <div className="overlay__container">
          <h1 className="h1">Channel name</h1>
          <input type="text" ref={ref}/>
          <button type="button" className="btn btn__overlay-select" onClick={createChannel}>Create
          </button>
        </div>
      </div>
  );
}

export default CreateChannelOverlay;