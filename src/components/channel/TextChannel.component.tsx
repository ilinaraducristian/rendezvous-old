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
import {useAppDispatch, useAppSelector} from "state-management/store";
import ChannelButtonComponent from "components/channel/ChannelButton/ChannelButton.component";
import {TextChannel} from "dtos/channel.dto";
import {HeaderTypes, ThirdPanelTypes} from "types/UISelectionModes";
import {getMessages} from "providers/socketio";
import {useKeycloak} from "@react-keycloak/web";
import {selectSelectedServer} from "../../state-management/selectors/data.selector";
import checkPermission from "../../util/check-permission";

type ComponentProps = DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> & {
    channel: TextChannel
}

function TextChannelComponent({channel, ...props}: ComponentProps) {

    const dispatch = useAppDispatch();
    const {initialized, keycloak} = useKeycloak();
    const selectedServer = useAppSelector(selectSelectedServer);

    const selectChannel = useCallback(async () => {
        if (checkPermission(initialized, keycloak, selectedServer, 'readMessages') === undefined) return;

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
    }, [channel.id, channel.serverId, initialized, keycloak, selectedServer]);

    const [, drag] = useDrag<ChannelDragObject, any, any>(() => {
        let canDrag = true;

        if (checkPermission(initialized, keycloak, selectedServer, 'moveChannels') === undefined) canDrag = false;

        return {
            type: ItemTypes.CHANNEL,
            canDrag: _ => canDrag,
            item: {id: channel.id, order: channel.order, groupId: channel.groupId},
        }
    }, [channel, initialized, keycloak, selectedServer]);

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