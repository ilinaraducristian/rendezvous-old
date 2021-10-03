import {useAppDispatch} from "state-management/store";
import {
    addMessages,
    selectFriendship as selectFriendAction,
    setThirdPanel,
} from "state-management/slices/data/data.slice";
import {ThirdPanelTypes} from "types/UISelectionModes";
import {User} from "dtos/user.dto";
import AvatarWithStatusSVG from "svg/AvatarWithStatus/AvatarWithStatus.svg";
import {getMessages} from "providers/ReactSocketIO.provider";
import ButtonComponent from "components/ButtonComponent";
import styles from "components/friend/Friend/Friend.module.css";

type ComponentProps = {
    friendshipId: number,
    user: User
}

function FriendComponent({friendshipId, user}: ComponentProps) {

    const dispatch = useAppDispatch();

    async function selectFriend() {
        const messages = await getMessages({friendshipId: friendshipId, serverId: null, channelId: null, offset: 0});
        dispatch(setThirdPanel(ThirdPanelTypes.messages));
        dispatch(selectFriendAction(friendshipId));
        dispatch(addMessages(messages));
    }

    return (
        <li className={styles.li}>
            <ButtonComponent className={styles.button} onClick={selectFriend}>
                <AvatarWithStatusSVG/>
                {user.firstName} {user.lastName}
            </ButtonComponent>
        </li>
    );

}

export default FriendComponent;