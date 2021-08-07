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

  function emojiCheck(event: any) {
    const selection = getSelection();
    if (selection === null) return setShortcut(null);
    const caret = selection.anchorOffset;
    let message = event.target.innerText as string | undefined;
    if (message === undefined)
      return setShortcut(null);
    const lastIndexColon = message.lastIndexOf(":", caret);
    if (lastIndexColon === -1 || caret <= lastIndexColon) return setShortcut(null);
    message = message.substring(lastIndexColon, caret);
    if (message.indexOf(" ") !== -1) return setShortcut(null);
    const msg = message.substr(1);
    if (msg.length === 0) return setShortcut(null);
    setShortcut(msg);
  }

  const onKeyPress = useCallback(async event => {
    emojiCheck(event);
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
        <EmojiContainerComponent shortcut={shortcut}/>
        <footer
            className="footer__content"
        >
          <button type="button" className="btn btn--off btn--hover btn__icon">
            <PlusSVG/>
          </button>
          <span className="span__input-message"
                role="textbox"
                contentEditable
                onKeyUp={onKeyPress}
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