import {useAppSelector} from "state-management/store";
import {
    selectFriendRequests,
    selectFriendships,
    selectThirdPanel,
    selectUsers,
} from "state-management/selectors/data.selector";
import {ThirdPanelTypes} from "types/UISelectionModes";
import styles from "./ThirdPanel.module.css";
import ThirdPanelFriendComponent from "components/third-panel/ThirdPanelFriend/ThirdPanelFriend.component";
import MessagesPanelComponent from "components/message/MessagesPanel/MessagesPanel.component";

function ThirdPanelComponent() {

    // const [isMembersSelected, setIsMembersSelected] = useState(true);

    // const selectedChannel = useAppSelector(selectSelectedChannel);
    const thirdPanel = useAppSelector(selectThirdPanel);
    const friends = useAppSelector(selectFriendships);
    const users = useAppSelector(selectUsers);
    const friendRequests = useAppSelector(selectFriendRequests);

    return (
        <div className={styles.divContainer}>
            {
                thirdPanel !== ThirdPanelTypes.messages ||
                <MessagesPanelComponent/>
            }
            {
                thirdPanel !== ThirdPanelTypes.allFriends ||
                <ul className={`list ${styles.ul}`}>
                    {
                        friends.map(friend => users.find(user => user.id === friend.user1Id || user.id === friend.user2Id))
                            .map((friend, i) => {
                                if (friend === undefined) return null;
                                return <ThirdPanelFriendComponent key={`friend_${i}`} user={friend}/>;
                            })
                    }
                </ul>
            }
            {
                thirdPanel !== ThirdPanelTypes.pendingFriendRequests ||
                <ul className={`list ${styles.ul}`}>
                    {friendRequests.map(friendRequest => ({
                        friend: users.find(user => user.id === friendRequest.userId),
                        friendRequest,
                    }))
                        .map(({friend, friendRequest}, i) => {
                                if (friend === undefined) return null;
                                return <ThirdPanelFriendComponent key={`pending_friend-request_${i}`} user={friend}
                                                                  friendRequest={friendRequest}/>;
                            },
                        )}
                </ul>
            }
        </div>
    );

}

export default ThirdPanelComponent;