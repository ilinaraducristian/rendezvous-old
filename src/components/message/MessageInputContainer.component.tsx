import PlusSVG from "svg/Plus.svg";
import MessageInputComponent from "components/message/MessageInput.component";
import GIFSVG from "svg/GIF.svg";
import styled from "styled-components";
import {useCallback, useRef, useState} from "react";
import EmojiContainerComponent from "components/message/EmojiContainer.component";
import trie from "trie";
import {addMessages} from "state-management/slices/serversSlice";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {selectSelectedChannel} from "state-management/selectors";
import socket from "socketio";

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

  const onKeyDown = useCallback((event) => {
    if (emojiRef.current === null) return;
    if (!isEmojiShown) return;
    if (event.code.includes("Enter")) {
      event.preventDefault();
      const selection = getSelection();
      if (selection === null) return;
      const cursorPosition = selection.anchorOffset;
      let message = event.target.innerText as string | undefined;
      if (message === undefined) return;
      // find last ":" until cursor position
      const lastIndexOfColon = message.lastIndexOf(":", cursorPosition);
      if (lastIndexOfColon === -1) return;
      // from ":" to cursor position
      event.target.innerText = `${message.substring(0, lastIndexOfColon)}${emojiRef.current.getEmoji()}${message.substring(cursorPosition + 1)}`;
      selection.setPosition(selection.focusNode, 1);
      setFoundEmojis([]);
      setIsEmojiShown(false);
      return;
    }
    if (!["ArrowDown", "ArrowUp"].includes(event.code)) return;
    event.preventDefault();
    emojiRef.current.move(event.code === "ArrowUp");
  }, [isEmojiShown]);

  const onKeyUp = useCallback(async (event) => {
    const emojis = shouldDisplayEmojiPanel(event);
    if (emojis !== undefined) {
      setIsEmojiShown(true);
      setFoundEmojis(emojis);
      return;
    }
    setIsEmojiShown(false);
    setFoundEmojis([]);
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

  function shouldDisplayEmojiPanel(event: any) {
    const selection = getSelection();
    if (selection === null) return;
    const cursorPosition = selection.anchorOffset;
    let message = event.target.innerText as string | undefined;
    if (message === undefined) return;
    // find last ":" until cursor position
    const lastIndexOfColon = message.lastIndexOf(":", cursorPosition);
    if (lastIndexOfColon === -1) return;
    // from ":" to cursor position
    message = message.substring(lastIndexOfColon, cursorPosition);
    const indexOfSpace = message.indexOf(" ");
    // if command contains white spaces return
    if (indexOfSpace !== -1) return;
    if (message.charCodeAt(message.length - 1) === 160) return;
    const emojis = trie.search(message);
    if (emojis.length === 0) return;
    return emojis;
  }

  const onClick = useCallback((event) => {
    const emojis = shouldDisplayEmojiPanel(event);
    if (emojis === undefined) {
      setIsEmojiShown(false);
      setFoundEmojis([]);
    } else {
      setIsEmojiShown(true);
      setFoundEmojis(emojis);
    }
  }, []);

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
          onKeyUp={onKeyUp}
          onClick={onClick}
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
  background-image: url("assets/emojis.png");
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