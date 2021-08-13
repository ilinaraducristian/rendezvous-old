import {useEffect, useRef} from "react";
import config from "../../config";
import {useLazyCreateChannelQuery} from "../../state-management/apis/socketio";
import {addChannel, selectChannel, selectSelectedServer, setOverlay} from "../../state-management/slices/serversSlice";
import {useAppDispatch, useAppSelector} from "../../state-management/store";
import {ChannelType, TextChannel} from "../../types/Channel";

type ComponentProps = {
  groupId?: number | null
}

function CreateChannelOverlayComponent({groupId = null}: ComponentProps) {

  const ref = useRef<HTMLInputElement>(null);
  const selectedServer = useAppSelector(selectSelectedServer);
  const [fetch, {data, isSuccess}] = useLazyCreateChannelQuery();
  const dispatch = useAppDispatch();

  function createChannel() {
    if (config.offline) return;
    if (selectedServer === undefined) return;
    // TODO
    const channelName = ref.current?.value as string;
    fetch({serverId: selectedServer.id, groupId, channelName});
  }

  useEffect(() => {
    if (selectedServer === undefined) return;
    if (!isSuccess) return;
    if (data === undefined) return;
    const channelName = ref.current?.value as string;
    const channel: TextChannel = {
      id: data?.channelId,
      serverId: selectedServer.id,
      groupId,
      type: ChannelType.Text,
      name: channelName,
      messages: [],
      order: 0
    };
    dispatch(addChannel(channel));
    dispatch(selectChannel(channel.id));
    dispatch(setOverlay(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

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

export default CreateChannelOverlayComponent;