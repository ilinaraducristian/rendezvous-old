import { observer } from "mobx-react-lite";
import RootState from "../../state/root-state";
import MessageInputComponent from "../MessageInput.component";
import MessagesComponent from "../Messages.component";
import "./ForthPanel.component.css";

type ComponentProps = { rootState: RootState };

const ForthPanelComponent = observer(({ rootState }: ComponentProps) => {
  return (
    <div className="forth-panel">
      <MessagesComponent rootState={rootState} />
      {(rootState.selectedChannel === null && rootState.selectedFriendship === null) || <MessageInputComponent rootState={rootState} />}
    </div>
  );
});

export default ForthPanelComponent;
