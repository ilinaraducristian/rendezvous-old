import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import FriendshipStatus from "../../dtos/friendship-status";
import Friendship from "../../entities/friendship";
import keycloak from "../../keycloak";
import { FriendshipsState } from "../../state/friendships-state";
import RootState from "../../state/root-state";


type ComponentProps = {
  rootState: RootState;
  friendshipsState: FriendshipsState;
};

const FriendshipsComponent = observer(({ rootState, friendshipsState }: ComponentProps) => {
  const selectFriendship = useCallback((friendship: Friendship) => {
    rootState.selectedFriendship = friendship;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteFriendship = useCallback(async (friendship: Friendship) => {
    await friendship.apiDelete();
    friendshipsState.friendships.delete(friendship.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptFriendship = useCallback(async (friendship: Friendship) => {
    await friendship.apiUpdate(FriendshipStatus.accepted);
    friendship.status = FriendshipStatus.accepted;
  }, []);

  const rejectFriendship = useCallback(async (friendship: Friendship) => {
    await friendship.apiUpdate(FriendshipStatus.rejected);
    friendship.status = FriendshipStatus.rejected;
  }, []);

  return (
    <>
      {friendshipsState.friendships.map((friendship) => (
        <li key={friendship.id} className={rootState.selectedFriendship?.id === friendship.id ? "selected" : ''}>
          {friendship.status !== FriendshipStatus.accepted || (
            <>
              <button type="button" onClick={() => selectFriendship(friendship)}>
                {rootState.users.get(friendship.friendId)?.username ?? friendship.friendId}
              </button>
              <button type="button" onClick={() => deleteFriendship(friendship)}>
                X
              </button>
            </>
          )}
          {friendship.status !== FriendshipStatus.pending || friendship.user2Id !== keycloak.subject || (
            <div>
              <span>{rootState.users.get(friendship.friendId)?.username ?? friendship.friendId}</span>
              <button type="button" onClick={() => acceptFriendship(friendship)}>
                ✓
              </button>
              <button type="button" onClick={() => rejectFriendship(friendship)}>
                x
              </button>
            </div>
          )}
          {friendship.status !== FriendshipStatus.pending || friendship.user2Id === keycloak.subject || (
            <div>
              <span>{rootState.users.get(friendship.friendId)?.username ?? friendship.friendId}</span>
              <div>pending</div>
            </div>
          )}
        </li>
      ))}
    </>
  );
});

export default FriendshipsComponent;
