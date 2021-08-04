import {ClipboardEvent, useCallback, useEffect, useRef} from "react";
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

function MessagesPanelComponent() {

  const messagesList = useRef<HTMLDivElement>(null);
  const messages = useAppSelector(selectMessages);
  const selectedChannel = useAppSelector(selectSelectedChannel);
  const users = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();

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
  );

}

export default MessagesPanelComponent;