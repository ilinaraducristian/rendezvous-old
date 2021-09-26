import styled from "styled-components";
import {useAppDispatch} from "../../state-management/store";
import {
    addMessages,
    selectFriendship as selectFriendAction,
    setThirdPanel
} from "../../state-management/slices/data/data.slice";
import {ThirdPanelTypes} from "../../types/UISelectionModes";
import {User} from "../../dtos/user.dto";
import AvatarWithStatusSVG from "../../svg/AvatarWithStatus.svg";
import {getMessages} from "../../socketio/ReactSocketIOProvider";

type ComponentProps = {
    friendshipId: number,
    user: User
}

function FriendComponent({friendshipId, user}: ComponentProps) {

    const dispatch = useAppDispatch();

    async function selectFriend() {
        const messages = await getMessages({friendshipId: friendshipId, serverId: null, channelId: null, offset: 0})
        dispatch(setThirdPanel(ThirdPanelTypes.messages))
        dispatch(selectFriendAction(friendshipId))
        dispatch(addMessages(messages));
    }

    return (
        <Li>
            <Button type="button" className="btn" onClick={selectFriend}>
                <AvatarWithStatusSVG/>
                {user.firstName} {user.lastName}
            </Button>
        </Li>
    );

}

/* CSS */

const Li = styled.li`
  color: var(--color-9th);
  padding: 0.5em 0 0.5em 0.5em;

  &:hover {
    color: var(--color-7th);
    background-color: var(--color-14th);
  }

`

const Button = styled.button`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: currentColor;
  width: 100%;
  height: 100%;
`;

/* CSS */

export default FriendComponent;