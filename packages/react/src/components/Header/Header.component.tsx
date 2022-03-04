import { observer } from "mobx-react-lite";
import RootState from "../../state/root-state";
import "./Header.component.css"

type ComponentProps = {
  rootState: RootState;
};

const HeaderComponent = observer(({ rootState }: ComponentProps) => {
  return (
    <header className="header">
      <span>
      {rootState.selectedChannel === null || rootState.selectedChannel.name}
      {rootState.selectedFriendship === null || rootState.users.get(rootState.selectedFriendship.friendId)?.username}
      </span>
    </header>
  );
});

export default HeaderComponent;
