import {useAppSelector} from "state-management/store";
import {selectFriendships, selectUsers} from "state-management/selectors/data.selector";
import FriendComponent from "components/friend/Friend.component";

function FriendsListComponent() {

    const friendships = useAppSelector(selectFriendships);
    const users = useAppSelector(selectUsers);
    // const friendUsers: User[] = friendships.map(friend => users.find(user => user.id === friend.user1Id || user.id === friend.user2Id)).filter(user => user !== undefined) as User[];

    return <ul className="list">
        {friendships.map((friendship) => {
                const user = users.find(user => user.id === friendship.user1Id || user.id === friendship.user2Id)
                if (user === undefined) return null;
                return <FriendComponent key={`friend_${user.id}`} friendshipId={friendship.id} user={user}/>
            }
        )}
    </ul>;
}

/* CSS */

/* CSS */

export default FriendsListComponent;
