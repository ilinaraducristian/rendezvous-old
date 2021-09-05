import {useAppSelector} from "state-management/store";
import styled from "styled-components";
import {
    selectFriendRequests,
    selectFriendships,
    selectThirdPanel,
    selectUsers
} from "state-management/selectors/data.selector";
import {ThirdPanelTypes} from "../../types/UISelectionModes";
import {useLazyAcceptFriendRequestQuery} from "../../state-management/apis/socketio";
import MessagesPanelComponent from "../message/MessagesPanel.component";

function ThirdPanelComponent() {

    // const [isMembersSelected, setIsMembersSelected] = useState(true);

    // const selectedChannel = useAppSelector(selectSelectedChannel);
    const thirdPanel = useAppSelector(selectThirdPanel)
    const friends = useAppSelector(selectFriendships)
    const users = useAppSelector(selectUsers)
    const friendRequests = useAppSelector(selectFriendRequests)
    const [fetch] = useLazyAcceptFriendRequestQuery();

    function acceptFriendRequest(userId: string, friendRequestId: number) {
        fetch({friendRequestId})
    }

    return (
        <DivContainer>
            <DivContentBody>
                {
                    thirdPanel !== ThirdPanelTypes.messages ||
                    <MessagesPanelComponent/>
                }
                {
                    thirdPanel !== ThirdPanelTypes.allFriends ||
                    <ul className="list">
                        {
                            friends.map(friend => users.find(user => user.id === friend.user1Id || user.id === friend.user2Id))
                                .map((friend, i) => <li key={`friend_${i}`}><span>{friend?.username}</span></li>)
                        }
                    </ul>
                }
                {
                    thirdPanel !== ThirdPanelTypes.pendingFriendRequests ||
                    <ul className="list">
                        {friendRequests.map((friendRequest, i) =>
                            <li key={`friendRequest_${i}`}>
                                <div>
                            <span>
                                {friendRequest.userId}
                            </span>
                                    {
                                        !friendRequest.incoming ||
                                        <button type="button"
                                                onClick={() => acceptFriendRequest(friendRequest.userId, friendRequest.id)}>
                                            Accept request
                                        </button>
                                    }
                                </div>
                            </li>
                        )}
                    </ul>
                }
            </DivContentBody>
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
  grid-area: third-panel;
  flex-grow: 1;
  background-color: var(--color-secondary);
  color: white;
  display: flex;
  flex-direction: column;
`;

const DivContentBody = styled.div`
  display: flex;
  flex-grow: 1;
  max-height: 100%;
`;

/* CSS */

export default ThirdPanelComponent;