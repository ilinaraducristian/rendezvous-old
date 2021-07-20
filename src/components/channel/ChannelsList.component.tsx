import {useContext, useMemo} from "react";
import {Channel} from "../../types";
import ChannelComponent from "./Channel.component";
import {GlobalStates} from "../../global-state";
import DropHandleComponent from "./DropHandle.component";

type ComponentProps = {
  groupId?: number | null
}

function channelMapper(groupId: number | null) {

  return (channel: any, index: number, array: [number, Channel][]) => {
    const channelComponents = [
      <DropHandleComponent key={`drop-handle_${index}`} index={index} groupId={groupId}/>,
      <ChannelComponent key={`channel_${channel.id}`} channel={channel}/>
    ];
    if (index === array.length - 1) {
      channelComponents.push(
          <DropHandleComponent key={`drop-handle_${index + 1}`} index={index + 1} groupId={groupId}/>
      );
    }

    return channelComponents;
  };
}

function ChannelsListComponent({groupId = null}: ComponentProps) {

  const {state} = useContext(GlobalStates);

  return useMemo(() => <>{
        Array.from(state.channels
            .filter((channel: Channel) =>
                channel.serverId === state.selectedServer?.id && channel.groupId === groupId
            ).sort((ch1, ch2) => ch1.order - ch2.order))
            .map(channelMapper(groupId)).flat(2)
      }</>
      , [groupId, state.channels, state.selectedServer]);

}

export default ChannelsListComponent;