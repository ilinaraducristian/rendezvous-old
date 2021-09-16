import {useCallback, useEffect, useRef} from "react";
import {useDrag} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "DnDItemTypes";
import {createProducer} from "mediasoup";
import {addChannelUsers, joinVoiceChannel} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import ChannelSVG from "svg/Channel.svg";
import config from "config";
import styled from "styled-components";
import ChannelButtonComponent from "components/channel/ChannelButton.component";
import {selectUsers} from "state-management/selectors/data.selector";
import {useLazyJoinVoiceChannelQuery} from "../../state-management/apis/socketio.api";
import {VoiceChannel} from "../../dtos/channel.dto";

type ComponentProps = {
    channel: VoiceChannel
}

function VoiceChannelComponent({channel}: ComponentProps) {

    const users = useAppSelector(selectUsers);
    const dispatch = useAppDispatch();
    const joined = useRef(false);
    const [fetch, {data: usersInVoiceChannel, isSuccess}] = useLazyJoinVoiceChannelQuery()

    const selectChannel = useCallback(async () => {
        if (config.offline) return;
        if (joined.current) return;
        joined.current = true;
        await createProducer();
        fetch({
            serverId: channel.serverId,
            channelId: channel.id
        });
    }, [channel, fetch]);

    useEffect(() => {
        if (!isSuccess || usersInVoiceChannel === undefined) return;
        dispatch(joinVoiceChannel({serverId: channel.serverId, groupId: channel.groupId, channelId: channel.id}));
        dispatch(addChannelUsers(usersInVoiceChannel));
    }, [usersInVoiceChannel, isSuccess, channel, dispatch])

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
            {
                <Ul className="list">
                    {
                        channel.users
                            .map(_user => users.find(user => user.id === _user.userId))
                            .filter(user => user !== undefined)
                            .map((user, i) =>
                                <li className="li" key={`channel_${channel.id}_user${i}`}>{user?.username}</li>
                            )
                    }
                </Ul>
            }
        </li>
    );

}

/* CSS */

const Ul = styled.ul`
  color: white;
`;

/* CSS */

export default VoiceChannelComponent;