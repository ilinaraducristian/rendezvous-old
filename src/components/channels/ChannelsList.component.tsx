import {Channel, ChannelType, TextChannel, VoiceChannel} from "../../types";
import ChannelDropHandleComponent from "./ChannelDropHandle.component";
import {useAppSelector} from "../../state-management/store";
import {selectChannels} from "../../state-management/slices/serversDataSlice";
import VoiceChannelComponent from "./VoiceChannel.component";
import TextChannelComponent from "./TextChannel.component";

type ComponentProps = {
  groupId?: number | null
}

function channelMapper(groupId: number | null) {

  return (channel: Channel, index: number, array: Channel[]) => {
    const channelComponents = [
      <ChannelDropHandleComponent key={`drop-handle_${index}`} index={index} groupId={groupId}/>,
      channel.type === ChannelType.Text ?
          <TextChannelComponent key={`channel_${channel.id}`} channel={channel as TextChannel}/>
          :
          <VoiceChannelComponent key={`channel_${channel.id}`} channel={channel as VoiceChannel}/>
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

  const channels = useAppSelector(selectChannels(groupId));

  return <>{
    channels === undefined ||
    Array.from(channels)
        .sort((ch1, ch2) => ch1.order - ch2.order)
        .map(channelMapper(groupId)).flat(2)
  }</>;

}

export default ChannelsListComponent;