import {DetailedHTMLProps, LiHTMLAttributes, useCallback} from "react";
import {useDrag} from "react-dnd";
import config from "config";
import ItemTypes, {ChannelDragObject} from "types/DnDItemTypes";
import {
    addMessages,
    selectChannel as selectChannelAction,
    setHeader,
    setThirdPanel,
} from "state-management/slices/data/data.slice";
import {useAppDispatch} from "state-management/store";
import ChannelButtonComponent from "components/channel/ChannelButton/ChannelButton.component";
import {TextChannel} from "dtos/channel.dto";
import {HeaderTypes, ThirdPanelTypes} from "types/UISelectionModes";
import {getMessages} from "providers/ReactSocketIO.provider";

type ComponentProps = DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> & {
    channel: TextChannel
}

function TextChannelComponent({channel, ...props}: ComponentProps) {

    const dispatch = useAppDispatch();

    const selectChannel = useCallback(async () => {
        if (!config.offline) {
            const messages = await getMessages({
                friendshipId: null,
                serverId: channel.serverId,
                channelId: channel.id,
                offset: 0,
            });
            dispatch(addMessages(messages));
            dispatch(selectChannelAction(channel.id));
            dispatch(setThirdPanel(ThirdPanelTypes.messages));
            dispatch(setHeader(HeaderTypes.channel));
            return;
        }
        dispatch(selectChannelAction(channel.id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel.id, channel.serverId]);

    const [, drag] = useDrag<ChannelDragObject, any, any>({
        type: ItemTypes.CHANNEL,
        item: {id: channel.id, order: channel.order, groupId: channel.groupId},
    }, [channel]);

    return (
        <li ref={drag} {...props}>
            <ChannelButtonComponent
                onClick={selectChannel}
                channelType={channel.type}
                channelName={channel.name}
            />
        </li>
    );

}

export default TextChannelComponent;