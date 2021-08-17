import styled from "styled-components";
import {ClipboardEvent, Dispatch, MutableRefObject, SetStateAction, useCallback, useRef} from "react";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedChannel} from "state-management/selectors";
import socket from "socketio";
import {addMessages} from "state-management/slices/serversSlice";

type ComponentProps = {
  emojiRef: MutableRefObject<any>,
  setShortcut: Dispatch<SetStateAction<string | null>>,
  isReplying: boolean,
  replyId?: number,
  messageSent: any
}

function MessageInputComponent({emojiRef, setShortcut, isReplying, replyId, messageSent}: ComponentProps) {

  const selectedChannel = useAppSelector(selectSelectedChannel);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

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
    let payload: {
      channelId: number,
      message: string,
      isReply: boolean,
      replyId: number | null,
    } = {
      channelId: selectedChannel.id,
      message,
      isReply: false,
      replyId: null
    };
    if (isReplying) {
      if (replyId === undefined) return;
      payload.isReply = true;
      payload.replyId = replyId;
    }
    message = await socket.emitAck("send_message", payload);
    messageSent();
    dispatch(addMessages([message]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel, isReplying]);

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