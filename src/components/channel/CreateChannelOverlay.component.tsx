import {useEffect, useRef} from "react";
import config from "../../config";
import {useLazyCreateChannelQuery} from "../../state-management/apis/socketio";
import {selectSelectedServer, serversDataSlice} from "../../state-management/slices/serversDataSlice";
import {useAppSelector} from "../../state-management/store";
import {ChannelType} from "../../types";

type ComponentProps = {
  groupId?: number | null
}

function CreateChannelOverlay({groupId = null}: ComponentProps) {

  const ref = useRef<HTMLInputElement>(null);
  const selectedServer = useAppSelector(selectSelectedServer);
  const [fetch, {data}] = useLazyCreateChannelQuery();

  function createChannel() {
    if (config.offline) return;
    if (selectedServer === null) return;
    // TODO
    const channelName = ref.current?.value as string;
    fetch({serverId: selectedServer.id, groupId, channelName});
  }

  useEffect(() => {
    if (selectedServer === null) return;
    const channelName = ref.current?.value as string;
    const channel = {
      id: data?.channelId,
      serverId: selectedServer.id,
      groupId,
      type: ChannelType.Text,
      name: channelName
    };
    serversDataSlice.actions.addChannel(channel);
    serversDataSlice.actions.selectChannel(channel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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