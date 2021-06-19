import useSocketIo from "../../util/use-socket-io";
import {useSocketEvent} from "socket.io-react-hook";
import {GlobalContext} from "../app/App.component";
import {useCallback, useState} from "react";
import {Message} from "../../types";

function MessagesPanelComponent() {

  const [message, setMessage] = useState("");
  const io = useSocketIo();
  const socketEvent = useSocketEvent<any>(io.socket, "send_message");

  const sendMessage = useCallback(() => {
    socketEvent.sendMessage(message);
  }, [message, socketEvent]);

  const consumer = useCallback(({messages: [messages]}) => {

    return (
        <>
          <ol className="list messages-body">
            {messages.map((message: Message) =>
                <li key={`channel_${message.id}`}>
                  {/*<span style={{marginRight: "0.5em"}}>{message.sender.username}</span>*/}
                  <span style={{marginRight: "0.5em"}}>{
                    `${message.timestamp.getHours()}:${message.timestamp.getMinutes()}`
                  }</span>
                  <span style={{marginRight: "0.5em"}}>{message.text}</span>
                </li>
            )}
          </ol>
          {
            messages.length === 0 ||
            <input type="text"
                   onChange={e => setMessage(e.target.value)}
                   onKeyUp={e => !e.code.includes("Enter") || sendMessage()}
            />
          }
        </>
    );

  }, [sendMessage]);

  return (
      <GlobalContext.Consumer>
        {consumer}
      </GlobalContext.Consumer>
  );

}

export default MessagesPanelComponent;