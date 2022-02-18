import { observer } from "mobx-react-lite";
import { useRef } from "react";
import Api from "../../api";
import { FriendshipsState } from "../../state/friendships-state";
import RootState from "../../state/root-state";

type ComponentProps = {
  rootState: RootState;
  friendshipsState: FriendshipsState;
};

const AddFriendOverlayComponent = observer(({ rootState, friendshipsState }: ComponentProps) => {
  const userIdRef = useRef<HTMLInputElement>(null);

  async function sendInvitation() {
    if (userIdRef.current === null) return;
    const friendship = await Api.newFriendship(userIdRef.current.value);
    friendshipsState.friendships.set(friendship.id, friendship);
    rootState.overlay = null;
  }

  return (
    <div>
      <span>user id</span>
      <input type="text" ref={userIdRef} />
      <button type="button" onClick={sendInvitation}>
        Send Invite
      </button>
    </div>
  );
});

export default AddFriendOverlayComponent;
