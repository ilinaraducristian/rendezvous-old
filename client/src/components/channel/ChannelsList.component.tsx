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
                channel.server_id === state.selectedServer?.id && channel.group_id === groupId
            )
                .map((channel: Channel) =>
                    <ChannelComponent channel={channel}/>
                )
          }</>
      , [groupId, state.channels, state.selectedServer?.id]);

}

export default ChannelsListComponent;