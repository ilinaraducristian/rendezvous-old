import {ClipboardEvent, useCallback, useEffect, useMemo, useRef} from "react";
import PlusSVG from "../../svg/Plus.svg";
import GIFSVG from "../../svg/GIF.svg";
import MessageComponent from "./Message.component";
import {User} from "../../types";
import {useAppSelector} from "../../state-management/store";
import {
  selectMessages,
  selectSelectedChannel,
  selectUsers,
  serversDataSlice
} from "../../state-management/slices/serversDataSlice";
import socket from "../../socketio";

function MessagesPanelComponent() {

  const messagesList = useRef<HTMLDivElement>(null);
  const messages = useAppSelector(selectMessages);
  const selectedChannel = useAppSelector(selectSelectedChannel);
  const users = useAppSelector(selectUsers);

  useEffect(() => {
    messagesList.current?.scroll(0, messagesList.current.scrollHeight);
  }, [messages]);

  const onCopy = useCallback((event: ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault();
    const selection = document.getSelection();
    const clipboard = event.clipboardData;
    if (selection === null || clipboard === null) return;
    clipboard.setData("text/plain", selection.toString());
  }, []);

  const onKeyPress = useCallback(async event => {
    if (!event.code.includes("Enter")) return;
    event.preventDefault();
    if (selectedChannel === null) return;
    let message = (event.target as any).innerText;
    (event.target as any).innerText = "";
    const payload = {
      channelId: selectedChannel.id,
      message
    };
    message = await socket.emitAck("send_message", payload);
    message.timestamp = new Date(message.timestamp);
    serversDataSlice.actions.setMessage(message);
  }, []);

  return useMemo(() =>
          <div className="content__body__main">
            <div className="content__body__messages" ref={messagesList}>
              <ol className="list list__messages">
                {
                  messages
                      .filter(message => message.channelId === selectedChannel?.id)
                      .map(message => {
                        const user = users.get(message.userId) as User;
                        return <MessageComponent key={`message_${message.id}`} username={user.username}
                                                 text={message.text}
                                                 timestamp={message.timestamp}/>;
                      })
                }
              </ol>
            </div>
            <footer
                className="footer__content"
            >
              <button type="button" className="btn btn--off btn--hover btn__icon">
                <PlusSVG/>
              </button>
              <span className="span__input-message"
                    role="textbox"
                    contentEditable
                    onKeyPress={onKeyPress}
                    onCopy={onCopy}
              />
              {/*<textarea*/}
              {/*    style={{height: '100%'}}*/}
              {/*    className="input__content-footer"*/}
              {/*    placeholder={`Message #${state.selectedChannel.name}`}*/}
              {/*    onChange={onChange}*/}
              {/*/>*/}
              <button type="button" className="btn btn--off btn--hover btn__icon">
                <GIFSVG/>
              </button>
              <button type="button" className="btn btn__icon">
                <div className="div__emoji div__emoji--hover"/>
              </button>
            </footer>
          </div>
      , [onCopy, onKeyPress]);

}

export default MessagesPanelComponent;