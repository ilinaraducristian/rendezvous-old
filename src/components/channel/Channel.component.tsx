import {useCallback, useContext, useMemo} from "react";
import {Channel} from "../../types";
import ChannelSVG from "../../svg/Channel.svg";
import {Actions, GlobalStates} from "../../global-state";
import useBackend from "../../hooks/backend.hook";
import config from "../../config";
import {useDrag} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";


type ComponentProps = {
  channel: Channel
}

function ChannelComponent({channel}: ComponentProps) {

  const {dispatch} = useContext(GlobalStates);
  const Backend = useBackend();

  const selectChannel = useCallback(async () => {
    if (!config.offline) {
      const messages = await Backend.getMessages(channel.serverId, channel.id, 0);
      dispatch({type: Actions.MESSAGES_ADDED, payload: messages});
    }
    dispatch({type: Actions.CHANNEL_SELECTED, payload: {...channel}});
  }, [Backend, channel, dispatch]);

  const [_, drag] = useDrag<ChannelDragObject, any, any>({
    type: ItemTypes.CHANNEL,
    item: {id: channel.id, order: channel.order}
  }, [channel.order]);

  return useMemo(() => (
      <li ref={drag}>
        <button className="btn btn__channel" type="button" onClick={selectChannel}>
          <ChannelSVG type={channel.type} isPrivate={false} className="svg__text-channel svg__text-channel--private"/>
          <span className="span">{channel.name}</span>
        </button>
      </li>
  ), [channel.name, channel.type, drag, selectChannel]);

}

export default ChannelComponent;