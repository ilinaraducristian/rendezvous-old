import {useCallback, useEffect, useRef} from "react";
import {useDrag} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "types/DnDItemTypes";
import {addChannelUsers, joinVoiceChannel} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import ChannelSVG from "svg/Channel.svg";
import config from "config";
import styled from "styled-components";
import ChannelButtonComponent from "components/channel/ChannelButton.component";
import {selectUsers} from "state-management/selectors/data.selector";

import {VoiceChannel} from "../../dtos/channel.dto";
import AvatarPlaceholder from "../../assets/avatar-placeholder.png";
import AvatarSVG from "../../svg/Avatar.svg";
import {useMediasoup} from "../../mediasoup/ReactMediasoupProvider";

type ComponentProps = {
    channel: VoiceChannel
}

function VoiceChannelComponent({channel}: ComponentProps) {

    const users = useAppSelector(selectUsers);
    const dispatch = useAppDispatch();
    const joined = useRef(false);

    const {createProducer} = useMediasoup();

    const selectChannel = useCallback(async () => {
        if (config.offline) return;
        if (joined.current) return;
        joined.current = true;
        await createProducer();
        fetch({
            serverId: channel.serverId,
            channelId: channel.id
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <span>{channel.name}</span>
            </ChannelButtonComponent>
            {
                <Ul className="list">
                    {
                        channel.users
                            .map(_user => ({
                                isTalking: _user.isTalking,
                                user: users.find(user => user.id === _user.userId)
                            }))
                            .map((user, i) => {
                                if (user.user === undefined) return <div/>
                                return (
                                    <li key={`channel_${channel.id}_user_${i}`}>
                                        <Button type="button" className="btn">
                                            <AvatarSVG sursa={AvatarPlaceholder} isActive={user.isTalking}/>
                                            <span>{`${user.user.firstName} ${user.user.lastName}`}</span>
                                        </Button>
                                    </li>
                                );
                            })
                    }
                </Ul>
            }
        </li>
    );

}

/* CSS */

const Ul = styled.ul`
  color: white;
  margin-left: 36px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  color: var(--color-9th);

  &:hover {
    color: var(--color-7th);
    background-color: var(--color-15th);
  }

`;

/* CSS */

export default VoiceChannelComponent;