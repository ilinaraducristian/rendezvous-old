import {useState} from "react";

function MessagesPanel({channel, messages, onSendMessage: sendMessage}: any) {

  const [message, setMessage] = useState('');

  return (
      <div className="messages-container">
        <div className="header">
          {channel?.name}
        </div>
        <div className="body">
          {messages}
        </div>
        < div
            className="footer">
          {
            channel === null ||
            <input type="text" onKeyUp={(event) => {
              if(event.key === 'Enter') {
                sendMessage(message);
                setMessage('');
              }
            }} onChange={e => setMessage(e.target.value)}/>
          }
        </div>
      </div>

  );
}

export default MessagesPanel;
