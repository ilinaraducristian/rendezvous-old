import {useCallback, useEffect} from "react";
import {useDrag} from "react-dnd";
import config from "../../config";
import {ChannelDragObject, ItemTypes} from "../../DnDItemTypes";
import {useLazyGetMessagesQuery} from "../../state-management/apis/socketio";
import {addMessages, selectChannel as selectChannelAction} from "../../state-management/slices/serversDataSlice";
import {useAppDispatch} from "../../state-management/store";
import ChannelSVG from "../../svg/Channel.svg";
import {TextChannel} from "../../types";

type ComponentProps = {
  channel: TextChannel
}

function TextChannelComponent({channel}: ComponentProps) {

  const [fetch, {data: messages, isSuccess}] = useLazyGetMessagesQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isSuccess) return;
    if (messages === undefined) return;
    dispatch(addMessages(messages));
    dispatch(selectChannelAction(channel.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const selectChannel = useCallback(() => {
    if (!config.offline) {
      // TODO HERE
      fetch({serverId: channel.serverId, channelId: channel.id, offset: 0});
      return;
    }
    dispatch(selectChannelAction(channel.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.id, channel.serverId]);

  const [, drag] = useDrag<ChannelDragObject, any, any>({
    type: ItemTypes.CHANNEL,
    item: {id: channel.id, order: channel.order}
  }, [channel.order]);

  return (
      <li ref={drag}>
        <button className="btn btn__channel" type="button" onClick={selectChannel}>
          <ChannelSVG type={channel.type} isPrivate={false} className="svg__text-channel svg__text-channel--private"/>
          <span className="span">{channel.name}</span>
        </button>
      </li>
  );

}

export default TextChannelComponent;