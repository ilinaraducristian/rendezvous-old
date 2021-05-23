import React, {useCallback, useEffect, useRef, useState} from "react";

function MessagesPanel({messages, onSendMessage: sendMessage}) {
    const [message, setMessage] = useState('');
    const [behind, setBehind] = useState(false);
    const [ticking, setTicking] = useState(false);
    const list = useRef(undefined);

    const elements = [];
    messages?.forEach((message, id) => {
        elements.push(
            <li key={`message_${id}`} className="message">
                {message.timestamp} {message.sender}: {message.text}
            </li>
        );
    });

    useEffect(() => {
        list?.current?.scrollTo({
            top: list.current.scrollHeight,
            left: 0,
            behavior: 'auto'
        });
    }, [messages]);

    function _sendMessage() {
        sendMessage(message);
        setMessage('');
    }

    function toBottom() {
        list?.current?.scrollTo({
            top: list?.current?.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    const onScroll = useCallback(() => {
        console.log(list?.current?.scrollTop);
        console.log(list?.current?.scrollHeight);
        if (list?.current?.scrollTop < list?.current?.scrollHeight - 500) {
            setBehind(true);
        } else {
            setBehind(false);
        }
    }, []);

    return (
        <div id="channel-content-container">
            <ul className="content" id="content" ref={list} onScroll={onScroll}>
                {elements}
            </ul>
            {
                messages ?
                    <div className="message-box">
                        {
                            behind ?
                                <button type="button" id="gotopresentbutton">Go to present</button>
                                : null
                        }
                        <input type="text" value={message} onChange={event => setMessage(event.target.value)}
                               onKeyUp={event => {
                                   if (event.code === 'NumpadEnter' || event.code === 'Enter') _sendMessage();
                               }}/>
                    </div>
                    : null
            }
        </div>
    );
}

export default MessagesPanel;
