import React, {useState} from "react";

function MessagesPanel({messages, onSendMessage: sendMessage}) {
    const [message, setMessage] = useState('');

    const elements = [];
    messages?.forEach((message, id) => {
        elements.push(
            <li key={`message_${id}`} className="message">
                {message.timestamp} {message.sender}: {message.text}
            </li>
        );
    });

    function _sendMessage() {
        sendMessage(message);
        setMessage('');
    }

    return (
        <div className="messages-container">
            <ul className="content" id="content">
                {elements}
            </ul>
            {
                messages ?
                    <div className="message-box">
                        <input type="text" value={message} onChange={event => setMessage(event.target.value)}
                               onKeyUp={event => {
                                   if (event.code === 'NumpadEnter' || event.code === 'Enter') _sendMessage();
                               }}/>
                        <button type="button" className="transparent-button" onClick={_sendMessage}>
                            send
                        </button>
                    </div>
                    : null
            }
        </div>
    );
}

export default MessagesPanel;
