import {ClipboardEvent, useCallback, useEffect, useRef, useState} from "react";
import PlusSVG from "../../svg/Plus.svg";
import GIFSVG from "../../svg/GIF.svg";
import MessageComponent from "./Message.component";
import {useAppDispatch, useAppSelector} from "../../state-management/store";
import {
  addMessages,
  selectMessages,
  selectSelectedChannel,
  selectUsers,
} from "../../state-management/slices/serversDataSlice";
import socket from "../../socketio";
import EmojiContainerComponent from "./EmojiContainer.component";

function MessagesPanelComponent() {

  const messagesList = useRef<HTMLDivElement>(null);
  const messages = useAppSelector(selectMessages);
  const selectedChannel = useAppSelector(selectSelectedChannel);
  const users = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();
  const [shortcut, setShortcut] = useState<string | null>(null);
  const [changeFcn, setChangeFcn] = useState<Function>();
  const emojiRef = useRef<any>(null);

  useEffect(() => {
    messagesList.current?.scroll(0, messagesList.current.scrollHeight);
  }, [messages]);

  const onCopy = useCallback((event: ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault();
    const selection = getSelection();
    const clipboard = event.clipboardData;
    if (selection === null || clipboard === null) return;
    clipboard.setData("text/plain", selection.toString());
  }, []);

  function emojiCheck(event: any): boolean {
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

  const onKeyPress = useCallback(async event => {
    if (emojiCheck(event) && (event.code === "ArrowDown" || event.code === "ArrowUp")) {
      emojiRef.current?.move(event);
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
  }, [selectedChannel, changeFcn]);

  return (
      <div className="content__body__main">
        <div className="content__body__messages" ref={messagesList}>
          <ol className="list list__messages">
            {
              messages?.map(message =>
                  <MessageComponent key={`message_${message.id}`}
                                    username={users.find(user => user.id === message.userId)?.username || ""}
                                    text={message.text}
                                    timestamp={message.timestamp}
                  />
              )
            }
          </ol>
        </div>
        <EmojiContainerComponent ref={emojiRef} shortcut={shortcut} setChangeFcn={setChangeFcn}/>
        <footer
            className="footer__content"
        >
          <button type="button" className="btn btn--off btn--hover btn__icon">
            <PlusSVG/>
          </button>
          <span className="span__input-message"
                role="textbox"
                contentEditable
                onKeyDown={onKeyPress}
                onCopy={onCopy}
                onClick={emojiCheck}
          />
          <button type="button" className="btn btn--off btn--hover btn__icon">
            <GIFSVG/>
          </button>
          <button type="button" className="btn btn__icon">
            <div className="div__emoji div__emoji--hover"/>
          </button>
        </footer>
      </div>
  );

}

export default MessagesPanelComponent;