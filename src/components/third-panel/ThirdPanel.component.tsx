import {useAppSelector} from "state-management/store";
import styled from "styled-components";
import {
    selectFriendRequests,
    selectFriendships,
    selectThirdPanel,
    selectUsers
} from "state-management/selectors/data.selector";
import {ThirdPanelTypes} from "../../types/UISelectionModes";
import MessagesPanelComponent from "../message/MessagesPanel.component";
import ThirdPanelFriendComponent from "./ThirdPanelFriend.component";

function ThirdPanelComponent() {

    // const [isMembersSelected, setIsMembersSelected] = useState(true);

    // const selectedChannel = useAppSelector(selectSelectedChannel);
    const thirdPanel = useAppSelector(selectThirdPanel)
    const friends = useAppSelector(selectFriendships)
    const users = useAppSelector(selectUsers)
    const friendRequests = useAppSelector(selectFriendRequests)

    return (
        <DivContainer>
                {
                    thirdPanel !== ThirdPanelTypes.messages ||
                    <MessagesPanelComponent/>
                }
                {
                    thirdPanel !== ThirdPanelTypes.allFriends ||
                    <Ul className="list">
                        {
                            friends.map(friend => users.find(user => user.id === friend.user1Id || user.id === friend.user2Id))
                                .map((friend, i) => {
                                    if (friend === undefined) return null;
                                    return <ThirdPanelFriendComponent key={`friend_${i}`} user={friend}/>;
                                })
                        }
                    </Ul>
                }
                {
                    thirdPanel !== ThirdPanelTypes.pendingFriendRequests ||
                    <Ul className="list">
                        {friendRequests.map(friendRequest => ({
                            friend: users.find(user => user.id === friendRequest.userId),
                            friendRequest
                        }))
                            .map(({friend, friendRequest}, i) => {
                                if (friend === undefined) return null;
                                    return <ThirdPanelFriendComponent key={`pending_friend-request_${i}`} user={friend}
                                                                      friendRequest={friendRequest}/>;
                                }
                            )}
                    </Ul>
                }
        </DivContainer>
    );

}

/* CSS */

// const Button = styled.button`
//   cursor: pointer;
//   display: flex;
//   align-content: space-between;
// `

const DivContainer = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: var(--color-2nd);
  color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Ul = styled.ul`
  width: 100%;
`;

/* CSS */

export default ThirdPanelComponent;