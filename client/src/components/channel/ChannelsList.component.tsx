import {GlobalContext} from "../app/App.component";
import {useCallback} from "react";
import {Channel} from "../../types";
import ChannelComponent from "./Channel.component";

type ComponentProps = {
  groupId?: number | null
}

function ChannelsListComponent({groupId = null}: ComponentProps) {

  const consumer = useCallback(props => {
    return (
        props.channels[0].filter((channel: Channel) =>
            channel.server_id === props.selectedServer[0]?.id && channel.group_id === groupId
        )
            .map((channel: Channel) =>
                <ChannelComponent channel={channel}/>
            )
    );

  }, [groupId]);

  return (
      <GlobalContext.Consumer>
        {consumer}
      </GlobalContext.Consumer>
  );

}

export default ChannelsListComponent;