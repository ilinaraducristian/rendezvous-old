import {useRef} from "react";
import {useDrag} from "react-dnd";
import {ChannelDragObject, ItemTypes} from "types/DnDItemTypes";
import {addChannelUsers, joinVoiceChannel as joinVoiceChannelAction} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import config from "config";
import ChannelButtonComponent from "components/channel/ChannelButton/ChannelButton.component";
import {selectJoinedChannel, selectUsers} from "state-management/selectors/data.selector";
import {VoiceChannel} from "dtos/channel.dto";
import AvatarPlaceholder from "assets/avatar-placeholder.png";
import AvatarSVG from "svg/Avatar.svg";
import {useMediasoup} from "providers/ReactMediasoup.provider";
import {joinVoiceChannel} from "providers/ReactSocketIO.provider";
import styles from "components/channel/VoiceChannel/VoiceChannel.module.css";
import ButtonComponent from "components/ButtonComponent";
import {useCallbackDebounced} from "util/debounce";

type ComponentProps = {
    channel: VoiceChannel
}

function VoiceChannelComponent({channel}: ComponentProps) {

    const users = useAppSelector(selectUsers);
    const dispatch = useAppDispatch();
    const joined = useRef(false);
    const joinedChannel = useAppSelector(selectJoinedChannel);

    const {createProducer} = useMediasoup();

    const selectChannel = useCallbackDebounced(async () => {
        if (config.offline) return;
        if (joined.current) return;
        joined.current = true;
        if (joinedChannel === null)
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
            <ul className={`list ${styles.ul}`}>
                {channel.users
                    .map((_user, i) => {
                        const user = users.find(user => user.id === _user.userId);
                        if (user === undefined) return <div/>;
                        return (
                            <li key={`channel_${channel.id}_user_${i}`}>
                                <ButtonComponent className={styles.button}>
                                    <AvatarSVG url={AvatarPlaceholder} isActive={joined.current && _user.isTalking}/>
                                    <span>{`${user.firstName} ${user.lastName}`}</span>
                                </ButtonComponent>
                            </li>
                        );
                    })}
            </ul>
        </li>
    );

}

export default VoiceChannelComponent;