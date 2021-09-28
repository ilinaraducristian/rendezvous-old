import {useAppSelector} from "state-management/store";
import {selectFriendships, selectUsers} from "state-management/selectors/data.selector";
import FriendComponent from "components/friend/Friend/Friend.component";
import styles from "components/friend/FriendsList/FriendsList.module.css";

function FriendsListComponent() {

    const friendships = useAppSelector(selectFriendships);
    const users = useAppSelector(selectUsers);

    return (
        <ul className={`list ${styles.ul}`}>
            {friendships.map((friendship, index) => {
                    const user = users.find(user => user.id === friendship.user1Id || user.id === friendship.user2Id);
                    if (user === undefined) return null;
                    return <FriendComponent key={`friendship_${index}`} friendshipId={friendship.id} user={user}/>;
                },
            )}
        </ul>
    );
}

export default FriendsListComponent;
