import useSocketIo from "../../util/use-socket-io";
import {useSocketEvent} from "socket.io-react-hook";
import {useCallback, useContext, useMemo, useState} from "react";
import {Message, User} from "../../types";
import {GlobalStates} from "../app/App.component";

function MessagesPanelComponent() {

  const [message, setMessage] = useState("");
  const io = useSocketIo();
  const socketEvent = useSocketEvent<any>(io.socket, "send_message");

  const sendMessage = useCallback(() => {
    socketEvent.sendMessage(message);
  }, [message, socketEvent]);

  const {state} = useContext(GlobalStates);

  return useMemo(() =>
          <>
            <ol className="list messages-body">
              {
                state.messages.filter((message: Message) => message.channel_id === state.selectedChannel?.id)
                    .map((message: Message) =>
                        <li key={`channel_${message.id}`}>
                          <span style={{marginRight: "0.5em"}}>{(state.users.get(message.user_id) as User).username}</span>
                          <span style={{marginRight: "0.5em"}}>{
                            `${message.timestamp.getHours()}:${message.timestamp.getMinutes()}`
                          }</span>
                          <span style={{marginRight: "0.5em"}}>{message.text}</span>
                        </li>
                    )
              }
            </ol>
            {
              state.selectedChannel === null ||
              <input type="text"
                     onChange={e => setMessage(e.target.value)}
                     onKeyUp={e => !e.code.includes("Enter") || sendMessage()}
              />
            }
          </>
      , [sendMessage, state.messages, state.selectedChannel, state.users]);

}

export default MessagesPanelComponent;