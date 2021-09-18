import {useAppSelector} from "state-management/store";
import {selectFriendships, selectUsers} from "state-management/selectors/data.selector";
import FriendComponent from "components/friend/Friend.component";
import styled from "styled-components";

function FriendsListComponent() {

    const friendships = useAppSelector(selectFriendships);
    const users = useAppSelector(selectUsers);
    // const friendUsers: User[] = friendships.map(friend => users.find(user => user.id === friend.user1Id || user.id === friend.user2Id)).filter(user => user !== undefined) as User[];

    return <Ul className="list">
        {friendships.map((friendship) => {
                const user = users.find(user => user.id === friendship.user1Id || user.id === friendship.user2Id)
                if (user === undefined) return null;
                return <FriendComponent key={`friend_${user.id}`} friendshipId={friendship.id} user={user}/>
            }
        )}
    </Ul>;
}

/* CSS */

const Ul = styled.ul`
  padding: 0.5em 0.5em 0;
`

/* CSS */

export default FriendsListComponent;
