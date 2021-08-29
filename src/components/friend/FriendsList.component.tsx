import {useAppSelector} from "state-management/store";
import {selectFriends, selectUsers} from "state-management/selectors/data.selector";
import User from "types/User";
import FriendComponent from "components/friend/Friend.component";

function FriendsListComponent() {

    const friends = useAppSelector(selectFriends);
    const users = useAppSelector(selectUsers);
    const friendUsers: (User | undefined)[] = friends.map(friend => users.find(user => user.id === friend));

    return <ul className="list">
        {friendUsers.map((user) =>
            user === undefined || <FriendComponent key={`friend_${user.id}`} user={user}/>
        )}
    </ul>;
}

/* CSS */

/* CSS */

export default FriendsListComponent;
