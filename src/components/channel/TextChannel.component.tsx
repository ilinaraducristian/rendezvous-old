import {useCallback, useEffect} from "react";
import {useDrag} from "react-dnd";
import config from "config";
import {ChannelDragObject, ItemTypes} from "DnDItemTypes";
import {useLazyGetMessagesQuery} from "state-management/apis/socketio";
import {
    addMessages,
    selectChannel as selectChannelAction,
    setHeader,
    setThirdPanel
} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import ChannelSVG from "svg/Channel.svg";
import ChannelButtonComponent from "components/channel/ChannelButton.component";
import {TextChannel} from "../../dtos/channel.dto";
import {HeaderTypes, ThirdPanelTypes} from "../../types/UISelectionModes";

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
      dispatch(setThirdPanel(ThirdPanelTypes.messages));
      dispatch(setHeader(HeaderTypes.channel))
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const selectChannel = useCallback(() => {
    if (!config.offline) {
        fetch({friendshipId: null, serverId: channel.serverId, channelId: channel.id, offset: 0});
      return;
    }
    dispatch(selectChannelAction(channel.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.id, channel.serverId]);

  const [, drag] = useDrag<ChannelDragObject, any, any>({
    type: ItemTypes.CHANNEL,
    item: {id: channel.id, order: channel.order, groupId: channel.groupId}
  }, [channel.order]);

  return (
      <li ref={drag}>
        <ChannelButtonComponent className="btn" type="button" onClick={selectChannel}>
          <ChannelSVG type={channel.type} isPrivate={false}/>
          <span className="span">{channel.name}</span>
        </ChannelButtonComponent>
      </li>
  );

}

export default TextChannelComponent;