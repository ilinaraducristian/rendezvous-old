import {useCallback, useRef} from "react";
import {useDrag} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "types/DnDItemTypes";
import {addChannelUsers, joinVoiceChannel as joinVoiceChannelAction} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import config from "config";
import ChannelButtonComponent from "components/channel/ChannelButton/ChannelButton.component";
import {selectUsers} from "state-management/selectors/data.selector";
import {VoiceChannel} from "dtos/channel.dto";
import AvatarPlaceholder from "assets/avatar-placeholder.png";
import AvatarSVG from "svg/Avatar.svg";
import {useMediasoup} from "mediasoup/ReactMediasoupProvider";
import {joinVoiceChannel} from "socketio/ReactSocketIOProvider";
import styles from "components/channel/VoiceChannel/VoiceChannel.module.css";
import ButtonComponent from "components/ButtonComponent";

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
        const usersInVoiceChannel = await joinVoiceChannel({
            serverId: channel.serverId,
            channelId: channel.id,
        });
        dispatch(joinVoiceChannelAction({serverId: channel.serverId, groupId: channel.groupId, channelId: channel.id}));
        dispatch(addChannelUsers(usersInVoiceChannel));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel]);

    const [, drag] = useDrag<ChannelDragObject, any, any>({
        type: ItemTypes.CHANNEL,
        item: {id: channel.id, order: channel.order, groupId: channel.groupId},
    }, [channel.order]);

    return (
        <li ref={drag}>
            <ChannelButtonComponent
                onClick={selectChannel}
                channelType={channel.type}
                channelName={channel.name}
            />
            {
                <ul className={`list ${styles.ul}`}>
                    {
                        channel.users
                            .map(_user => ({
                                isTalking: _user.isTalking,
                                user: users.find(user => user.id === _user.userId),
                            }))
                            .map((user, i) => {
                                if (user.user === undefined) return <div/>;
                                return (
                                    <li key={`channel_${channel.id}_user_${i}`}>
                                        <ButtonComponent className={styles.button}>
                                            <AvatarSVG url={AvatarPlaceholder} isActive={user.isTalking}/>
                                            <span>{`${user.user.firstName} ${user.user.lastName}`}</span>
                                        </ButtonComponent>
                                    </li>
                                );
                            })
                    }
                </ul>
            }
        </li>
    );

}

export default VoiceChannelComponent;