import {useCallback, useContext, useMemo} from "react";
import {Actions, GlobalStates} from "../../global-state";
import PlusSVG from "../../svg/Plus.svg";
import GIFSVG from "../../svg/GIF.svg";
import MessageComponent from "./MessageComponent";
import {Message, User} from "../../types";
import useSocketIo from "../../hooks/socketio.hook";
import SortedMap from "../../util/SortedMap";

function MessagesPanelComponent() {

  const {state, dispatch} = useContext(GlobalStates);
  const io = useSocketIo();

  const sendMessage = useCallback(event => {
    if (!event.code.includes("Enter")) return;
    event.preventDefault();
    const message = (event.target as any).innerText;
    (event.target as any).innerText = "";
    const payload = {
      channelId: state.selectedChannel?.id,
      message
    };
    io.socket.emit("send_message", payload, (message: Message) => {
      dispatch({
        type: Actions.MESSAGES_SET, payload: (messages: SortedMap<Message>) => {
          message.timestamp = new Date(message.timestamp);
          return messages.set(message.id, message).clone();
        }
      });
    });


  }, [dispatch, io.socket, state.selectedChannel?.id]);

  return useMemo(() =>
          <div className="content__body__main">
            <div className="content__body__messages">
              <ol className="list list__messages">
                {
                  state.messages
                      .filter(message => message.channelId === state.selectedChannel?.id)
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
                    onKeyPress={sendMessage}
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
      , [sendMessage, state.messages, state.selectedChannel?.id, state.users]);

}

export default MessagesPanelComponent;