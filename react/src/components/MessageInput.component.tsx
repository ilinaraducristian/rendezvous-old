import { observer } from "mobx-react-lite";
import { KeyboardEvent, useRef } from "react";
import RootState from "../state/root-state";

type ComponentProps = {
  rootState: RootState;
};

const MessageInputComponent = observer(({ rootState }: ComponentProps) => {
  const inputRef = useRef<HTMLSpanElement>(null);
  const channelOrFriendship = rootState.selectedChannel ?? rootState.selectedFriendship;

  function onKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter") {
      if (inputRef.current === null) return false;
      channelOrFriendship?.apiNewMessage(inputRef.current.innerHTML);
      inputRef.current.innerHTML = "";
      event.preventDefault();
      return false;
    }
  }

  return <span ref={inputRef} contentEditable="true" onKeyDown={onKeyDown} />;
});

export default MessageInputComponent;
