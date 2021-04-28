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
    return (
        <div className="messages-container">
            <ul className="content" id="content">
                {elements}
            </ul>
            <div className="message-box">
                <input type="text" value={message} onChange={event => setMessage(event.target.value)}/>
                <button type="button" className="transparent-button" onClick={() => sendMessage(message)}>
                    send
                </button>
            </div>
        </div>
    );
}

export default MessagesPanel;
