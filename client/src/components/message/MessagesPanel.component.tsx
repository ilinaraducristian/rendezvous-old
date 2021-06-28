import useSocketIo from "../../util/use-socket-io";
import {useSocketEvent} from "socket.io-react-hook";
import {useCallback, useContext, useMemo} from "react";
import {GlobalStates} from "../../global-state";
import PlusSVG from "../../svg/Plus.svg";
import GIFSVG from "../../svg/GIF.svg";
import MessageComponent from "./MessageComponent";
import {User} from "../../types";

function MessagesPanelComponent() {

  const {state} = useContext(GlobalStates);
  const io = useSocketIo();
  const socketEvent = useSocketEvent<any>(io.socket, "send_message");

  const sendMessage = useCallback(e => {
    let message: string;
    if (e.code.includes("Enter"))
      message = (e.target as any).innerText;
  }, []);


  return useMemo(() =>
          <div className="content__body__main">
            <div className="content__body__messages">
              <ol className="list">
                {
                  state.messages
                      .filter(message => message.channelId === state.selectedChannel?.id)
                      .map(message => {
                        const user = state.users.get(message.userId) as User;
                        return <MessageComponent key={`message_${message.id}`} username={user.username} text={message.text}
                                                 timestamp={message.timestamp}/>;
                      })
                }
              </ol>
            </div>
            <footer
                className="content__footer"
            >
              <button type="button" className="btn">
                <PlusSVG/>
              </button>
              <span className="span__input-message"
                    role="textbox"
                    contentEditable
                    onKeyUp={sendMessage}
              />
              {/*<textarea*/}
              {/*    style={{height: '100%'}}*/}
              {/*    className="input__content-footer"*/}
              {/*    placeholder={`Message #${state.selectedChannel.name}`}*/}
              {/*    onChange={onChange}*/}
              {/*/>*/}
              <button type="button" className="btn">
                <GIFSVG/>
              </button>
              <button type="button" className="btn btn__emoji"/>
            </footer>
          </div>
      , [sendMessage]);

  // return useMemo(() =>
  //         <>
  //           <ol className="list messages-body">
  //             {
  //               state.messages.filter((message: Message) => message.channelId === state.selectedChannel?.id)
  //                   .map((message: Message) =>
  //                       <li key={`channel_${message.id}`}>
  //                         <span
  //                             style={{marginRight: "0.5em"}}>{(state.users.get(message.userId) as User).username}</span>
  //                         <span style={{marginRight: "0.5em"}}>{
  //                           `${message.timestamp.getHours()}:${message.timestamp.getMinutes()}`
  //                         }</span>
  //                         <span style={{marginRight: "0.5em"}}>{message.text}</span>
  //                       </li>
  //                   )
  //             }
  //           </ol>
  //           {
  //             state.selectedChannel === null ||
  //             <input type="text"
  //                    onChange={e => setMessage(e.target.value)}
  //                    onKeyUp={e => !e.code.includes("Enter") || sendMessage()}
  //             />
  //           }
  //         </>
  //     , [sendMessage, state.messages, state.selectedChannel, state.users]);

}

export default MessagesPanelComponent;