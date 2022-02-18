import { observer } from "mobx-react-lite";
import { UIEvent, useEffect } from "react";
import RootState from "../state/root-state";
import MessageComponent from "./Message.component";

type ComponentProps = { rootState: RootState };

const MessagesComponent = observer(({ rootState }: ComponentProps) => {
  const messagesParent = rootState.selectedChannel ?? rootState.selectedFriendship;
  useEffect(() => {
    if (messagesParent === null) return;
    if (messagesParent.isInitialized) return;
    messagesParent.apiGetInitialMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootState.selectedFriendship, rootState.selectedChannel]);

  function onScroll(e: UIEvent<HTMLOListElement>) {
    if (messagesParent === null) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = 100 - Math.abs(scrollTop / (scrollHeight - clientHeight)) * 100;
    if (scrollPercentage > 10) return;
    messagesParent.apiGetMoreMessages();
  }

  return (
    <ol onScroll={onScroll}>
      {messagesParent === null ||
        !messagesParent.isInitialized ||
        messagesParent.messages.map((message) => <MessageComponent key={message.id} message={message} />)}
    </ol>
  );
});

export default MessagesComponent;
