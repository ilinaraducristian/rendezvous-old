import {useContext, useMemo} from "react";
import {Channel} from "../../types";
import ChannelComponent from "./Channel.component";
import {GlobalStates} from "../../global-state";

type ComponentProps = {
  groupId?: number | null
}

function ChannelsListComponent({groupId = null}: ComponentProps) {

  const {state} = useContext(GlobalStates);

  return useMemo(() =>
          <>{
            state.channels.filter((channel: Channel) =>
                channel.serverId === state.selectedServer?.id && channel.groupId === groupId
            )
                .map((channel: Channel) =>
                    <ChannelComponent key={`channel_${channel.id}`} channel={channel}/>
                )
          }</>
      , [groupId, state.channels, state.selectedServer]);

}

export default ChannelsListComponent;