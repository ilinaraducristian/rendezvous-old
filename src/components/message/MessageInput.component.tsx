import styled from "styled-components";
import {ClipboardEvent, Dispatch, MutableRefObject, SetStateAction, useCallback} from "react";
import socket from "../../socketio";
import {addMessages, selectSelectedChannel} from "../../state-management/slices/serversSlice";
import {useAppDispatch, useAppSelector} from "../../state-management/store";

type ComponentProps = {
  emojiRef: MutableRefObject<any>,
  setShortcut: Dispatch<SetStateAction<string | null>>
}

function MessageInputComponent({emojiRef, setShortcut}: ComponentProps) {

  const selectedChannel = useAppSelector(selectSelectedChannel);
  const dispatch = useAppDispatch();

  const onCopy = useCallback((event: ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault();
    const selection = getSelection();
    const clipboard = event.clipboardData;
    if (selection === null || clipboard === null) return;
    clipboard.setData("text/plain", selection.toString());
  }, []);

  function shouldShowEmojiComponent(event: any): boolean {
    const selection = getSelection();
    if (selection === null) {
      setShortcut(null);
      return false;
    }
    const caret = selection.anchorOffset;
    let message = event.target.innerText as string | undefined;
    if (message === undefined) {
      setShortcut(null);
      return false;
    }
    const lastIndexColon = message.lastIndexOf(":", caret);
    if (lastIndexColon === -1 || caret <= lastIndexColon) {
      setShortcut(null);
      return false;
    }
    message = message.substring(lastIndexColon, caret);
    if (message.indexOf(" ") !== -1) {
      setShortcut(null);
      return false;
    }
    const msg = message.substr(1);
    if (msg.length === 0) {
      setShortcut(null);
      return false;
    }
    setShortcut(msg);
    return true;
  }

  const onKeyDown = useCallback(async event => {
    if (shouldShowEmojiComponent(event) && ["ArrowDown", "ArrowUp", "Enter"].includes(event.code)) {
      if (event.code === "Enter") {
        console.log(emojiRef.current?.getEmoji());
      } else {
        emojiRef.current?.move(event);
      }
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!event.code.includes("Enter")) return;
    event.preventDefault();
    if (selectedChannel === undefined) return;
    let message = (event.target as any).innerText;
    (event.target as any).innerText = "";
    const payload = {
      channelId: selectedChannel.id,
      message
    };
    message = await socket.emitAck("send_message", payload);
    dispatch(addMessages([message]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel]);

  return (
      <Span
          role="textbox"
          contentEditable
          onKeyDown={onKeyDown}
          onCopy={onCopy}
          onClick={shouldShowEmojiComponent}
      />
  );
}

/* CSS */

const Span = styled.span`
  background: none;
  border: none;
  flex-grow: 1;
  word-wrap: anywhere;
  max-height: inherit;
  overflow-y: auto;
  align-self: center;

  &:focus {
    outline: none;
  }
`;

/* CSS */

export default MessageInputComponent;