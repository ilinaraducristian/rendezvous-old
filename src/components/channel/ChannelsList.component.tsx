import {Channel} from "../../types";
import ChannelComponent from "./Channel.component";
import ChannelDropHandleComponent from "./ChannelDropHandle.component";
import {useAppSelector} from "../../state-management/store";
import {selectChannels, selectSelectedServer} from "../../state-management/slices/serversDataSlice";

type ComponentProps = {
  groupId?: number | null
}

function channelMapper(groupId: number | null) {

  return (channel: any, index: number, array: [number, Channel][]) => {
    const channelComponents = [
      <ChannelDropHandleComponent key={`drop-handle_${index}`} index={index} groupId={groupId}/>,
      <ChannelComponent key={`channel_${channel.id}`} channel={channel}/>
    ];
    if (index === array.length - 1) {
      channelComponents.push(
          <ChannelDropHandleComponent key={`drop-handle_${index + 1}`} index={index + 1} groupId={groupId}/>
      );
    }

    return channelComponents;
  };
}

function ChannelsListComponent({groupId = null}: ComponentProps) {

  const channels = useAppSelector(selectChannels);
  const selectedServer = useAppSelector(selectSelectedServer);

  return <>{
    Array.from(channels
        .filter((channel: Channel) =>
            channel.serverId === selectedServer?.id && channel.groupId === groupId
        ).sort((ch1, ch2) => ch1.order - ch2.order))
        .map(channelMapper(groupId)).flat(2)
  }</>;

}

export default ChannelsListComponent;