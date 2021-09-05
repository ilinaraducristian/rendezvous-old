import User from "types/User";
import styled from "styled-components";
import {useAppDispatch} from "../../state-management/store";
import {
    addMessages,
    selectFriendship as selectFriendAction,
    setThirdPanel
} from "../../state-management/slices/data/data.slice";
import {ThirdPanelTypes} from "../../types/UISelectionModes";
import {useLazyGetMessagesQuery} from "../../state-management/apis/socketio";
import {useEffect} from "react";

type ComponentProps = {
    friendshipId: number,
    user: User
}

function FriendComponent({friendshipId, user}: ComponentProps) {

    const dispatch = useAppDispatch();
    const [fetch, {data: messages, isSuccess}] = useLazyGetMessagesQuery();

    useEffect(() => {
        if (!isSuccess || messages === undefined) return;
        dispatch(addMessages(messages));
    }, [isSuccess, messages, dispatch])

    function selectFriend() {
        fetch({friendshipId: friendshipId, serverId: null, channelId: null, offset: 0})
        dispatch(setThirdPanel(ThirdPanelTypes.messages))
        dispatch(selectFriendAction(friendshipId))
    }

    return (
        <li>
            <Button type="button" onClick={selectFriend}>
                {user.username}
            </Button>
        </li>
    );

}

/* CSS */

const Button = styled.button`
  cursor: pointer;
`;

/* CSS */

export default FriendComponent;