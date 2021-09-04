import PlusSVG from "svg/Plus.svg";
import MessageInputComponent from "components/message/MessageInput.component";
import GIFSVG from "svg/GIF.svg";
import styled from "styled-components";
import {useCallback, useRef, useState} from "react";
import EmojiContainerComponent from "components/message/EmojiContainer.component";
import trie from "trie";
import {addMessages} from "state-management/slices/data/data.slice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import socket from "socketio";
import {selectSelectedChannel} from "state-management/selectors/data.selector";

type ComponentProps = {
  isReplying: boolean,
  replyId?: number,
  messageSent: any,
}

function MessageInputContainerComponent({isReplying, replyId, messageSent}: ComponentProps) {

  const emojiRef = useRef<any>(null);
  const [isEmojiShown, setIsEmojiShown] = useState(false);
  const [foundEmojis, setFoundEmojis] = useState<any[]>([]);
  const selectedChannel = useAppSelector(selectSelectedChannel);
  const dispatch = useAppDispatch();

  const sendInputFieldContent = useCallback(async (event: any) => {
    event.preventDefault();
    if (selectedChannel === undefined) return;
    let message = (event.target as any).innerText;
    (event.target as any).innerText = "";
    let payload: {
      friendshipId: number | null,
      channelId: number,
      text: string,
      isReply: boolean,
      replyId: number | null,
      image: string | null
    } = {
      friendshipId: null,
      channelId: selectedChannel.id,
      text: message,
      isReply: false,
      replyId: null,
      image: null
    };
    if (isReplying) {
      if (replyId === undefined) return;
      payload.isReply = true;
      payload.replyId = replyId;
    }
    message = await socket.emitAck("send_message", payload);
    messageSent();
    dispatch(addMessages([message]));
  }, [dispatch, isReplying, messageSent, replyId, selectedChannel])

  function findLastIndexOfColon(event: any) {
    const selection = getSelection();
    if (selection === null) return;
    const cursorPosition = selection.anchorOffset;
    let message = event.target.innerText as string | undefined;
    if (message === undefined) return;
    // find last ":" until cursor position
    const lastIndexOfColon = message.lastIndexOf(":", cursorPosition);
    if (lastIndexOfColon === -1) return;
    return {
      selection,
      cursorPosition,
      message,
      lastIndexOfColon,
    };
  }

  const shouldDisplayEmojiPanel = useCallback((event: any) => {
    const lastIndexObject = findLastIndexOfColon(event);
    if (lastIndexObject === undefined) return;
    let {cursorPosition, message, lastIndexOfColon} = lastIndexObject;
    // from ":" to cursor position
    message = message.substring(lastIndexOfColon, cursorPosition);
    const indexOfSpace = message.indexOf(" ");
    // if command contains white spaces return
    if (indexOfSpace !== -1) return;
    if (message.charCodeAt(message.length - 1) === 160) return;
    const emojis = trie.search(message);
    if (emojis.length === 0) return;
    return emojis;
  }, []);

  const onKeyDown = useCallback((event) => {
    if (["ArrowDown", "ArrowUp"].includes(event.code) && isEmojiShown) {
      event.preventDefault();
      emojiRef.current?.move(event.code === "ArrowUp");
      return;
    }
    if (!event.code.includes("Enter")) return;
    if (!isEmojiShown)
      return sendInputFieldContent(event);
    event.preventDefault();
    const lastIndexObject = findLastIndexOfColon(event);
    if (lastIndexObject === undefined) return;
    let {selection, cursorPosition, message, lastIndexOfColon} = lastIndexObject;
    if (emojiRef.current === null) return;
    event.target.innerText = `${message.substring(0, lastIndexOfColon)}${emojiRef.current.getEmoji()}${message.substring(cursorPosition + 1)}`;
    selection.setPosition(selection.focusNode, 1);
    setFoundEmojis([]);
    setIsEmojiShown(false);
    return;

  }, [isEmojiShown, sendInputFieldContent]);

  const shouldDisplayEmojiPanelEventHandler = useCallback((event) => {
    const emojis = shouldDisplayEmojiPanel(event);
    if (emojis !== undefined) {
      setIsEmojiShown(true);
      setFoundEmojis(emojis);
      return;
    }
    setIsEmojiShown(false);
    setFoundEmojis([]);
  }, [shouldDisplayEmojiPanel]);

  return <>
    {
      !isEmojiShown ||
      <EmojiContainerComponent ref={emojiRef} foundEmojis={foundEmojis}/>
    }
    <Footer>
      <button type="button" className="btn btn--off btn--hover btn__icon">
        <PlusSVG/>
      </button>
      <MessageInputComponent
          onKeyDown={onKeyDown}
          onKeyUp={shouldDisplayEmojiPanelEventHandler}
          onClick={shouldDisplayEmojiPanelEventHandler}
      />
      <button type="button" className="btn btn--off btn--hover btn__icon">
        <GIFSVG/>
      </button>
      <button type="button" className="btn btn__icon">
        <DivEmoji/>
      </button>
    </Footer>
  </>;

}

/* CSS */

const Footer = styled.footer`
  background-color: var(--color-fifth);
  border-radius: 0.5em;
  max-height: 12.5em;
  margin: 0 1em 1.5em 1em;
  display: flex;
  align-items: flex-start;
`;

const DivEmoji = styled.div`
  background-image: url("../../assets/emojis.png");
  background-position: 0 0;
  background-size: 242px 110px;
  background-repeat: no-repeat;
  width: 22px;
  height: 22px;
  transform: scale(1);
  filter: grayscale(100%);

  &:hover {
    transform: scale(1.14);
    filter: grayscale(0%);
  }
`;

/* CSS */

export default MessageInputContainerComponent;