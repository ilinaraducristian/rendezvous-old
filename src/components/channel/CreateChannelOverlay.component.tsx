import {useCallback, useRef} from "react";
import config from "../../config";
import {selectSelectedServer, selectServers, serversDataSlice} from "../../state-management/slices/serversDataSlice";
import {useAppSelector} from "../../state-management/store";
import {useCreateChannelQuery} from "../../state-management/apis/socketio";
import {ChannelType, Server} from "../../types";

type ComponentProps = {
  groupId?: number | null
}

function CreateChannelOverlay({groupId = null}: ComponentProps) {

  const ref = useRef<HTMLInputElement>(null);
  const selectedServer = useAppSelector(selectSelectedServer);
  const servers = useAppSelector(selectServers);


  const createChannel = useCallback(async () => {
    if (!config.offline) {
      // TODO
      if (selectedServer === null) return;
      const channelName = ref.current?.value as string;
      const _selectedServer = servers.get(selectedServer.id) as Server;
      const {data} = useCreateChannelQuery({serverId: selectedServer.id, groupId, channelName});
      const channel = {
        id: data?.channelId,
        serverId: _selectedServer.id,
        groupId,
        type: ChannelType.Text,
        name: channelName
      };
      serversDataSlice.actions.addChannel(channel);
      serversDataSlice.actions.selectChannel(channel);
    }
  }, [groupId]);

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