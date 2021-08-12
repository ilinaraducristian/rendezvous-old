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

  return (channel: Channel, index: number) => {
    return [
      channel.type === ChannelType.Text ?
          <TextChannelComponent key={`channel_${channel.id}`} channel={channel as TextChannel}/>
          :
          <VoiceChannelComponent key={`channel_${channel.id}`} channel={channel as VoiceChannel}/>
      ,
      <ChannelDropHandleComponent key={`drop-handle_${index + 1}`} index={index + 1} groupId={groupId}/>
    ];
  };
}

function ChannelsListComponent({groupId = null}: ComponentProps) {

  const channels = useAppSelector(selectChannels(groupId));

  return <>
    <ChannelDropHandleComponent key={`drop-handle_0`} index={0} groupId={groupId}/>
    {channels === undefined ||
    Array.from(channels)
        .sort((ch1, ch2) => ch1.order - ch2.order)
        .map(channelMapper(groupId)).flat(2)
    }</>;

}

export default ChannelsListComponent;