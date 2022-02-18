import { observer } from "mobx-react-lite";
import RootState from "../state/root-state";
import FifthPanelComponent from "./FifthPanel/FifthPanel.component";
import MessageInputComponent from "./MessageInput.component";
import MessagesComponent from "./Messages.component";

type ComponentProps = {
  rootState: RootState;
};

const ContentBodyComponent = observer(({ rootState }: ComponentProps) => {
  return (
    <div>
      <div>
        <MessagesComponent rootState={rootState} />
        {(rootState.selectedChannel === null && rootState.selectedFriendship === null) || <MessageInputComponent rootState={rootState} />}
      </div>
      <FifthPanelComponent rootState={rootState} />
    </div>
  );
});

export default ContentBodyComponent;
