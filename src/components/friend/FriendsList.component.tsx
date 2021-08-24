import {useAppSelector} from "state-management/store";
import {selectFriends, selectUsers} from "state-management/selectors/data.selector";
import User from "types/User";
import FriendComponent from "components/friend/Friend.component";
import styled from "styled-components";

function FriendsListComponent() {

  const friends = useAppSelector(selectFriends);
  const users = useAppSelector(selectUsers);
  const friendUsers: User[] = [];
  friends.forEach(friend => {
    const found = users.find(user => user.id === friend);
    if (found === undefined) return;
    friendUsers.push(found);
  });

  return <Ul>
    {friendUsers
        .map((user) => <FriendComponent key={`friend_${user.id}`} user={user}/>)
    }</Ul>;
}

/* CSS */

const Ul = styled.ul`
  list-style: none;
`;

/* CSS */

export default FriendsListComponent;
