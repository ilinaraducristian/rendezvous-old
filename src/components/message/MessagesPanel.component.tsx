import {ClipboardEvent, useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {GlobalStates} from "../../state-management/global-state";
import PlusSVG from "../../svg/Plus.svg";
import GIFSVG from "../../svg/GIF.svg";
import MessageComponent from "./Message.component";
import {User} from "../../types";
import useSocketIo from "../../hooks/socketio.hook";
import Actions from "../../state-management/actions";

function MessagesPanelComponent() {

  const {state, dispatch} = useContext(GlobalStates);
  const {socket} = useSocketIo();
  const messagesList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesList.current?.scroll(0, messagesList.current.scrollHeight);
  }, [state.messages, state.selectedChannel]);

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
    let message = (event.target as any).innerText;
    (event.target as any).innerText = "";
    const payload = {
      channelId: state.selectedChannel.id,
      message
    };
    message = await socket.emitAck("send_message", payload);
    message.timestamp = new Date(message.timestamp);
    dispatch({
      type: Actions.MESSAGES_SET, payload: state.messages.set(message.id, message)
    });


  }, [dispatch, socket, state.selectedChannel, state.messages]);

  return useMemo(() =>
          <div className="content__body__main">
            <div className="content__body__messages" ref={messagesList}>
              <ol className="list list__messages">
                {
                  state.messages
                      .filter(message => message.channelId === state.selectedChannel.id)
                      .map(message => {
                        const user = state.users.get(message.userId) as User;
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
      , [onCopy, onKeyPress, state.messages, state.selectedChannel, state.users]);

}

export default MessagesPanelComponent;