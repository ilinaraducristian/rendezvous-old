type ComponentProps = {
  username: string,
  timestamp: Date,
  text: string
}

function MessageComponent({username, timestamp, text}: ComponentProps) {

  return (
      <div className="message-container">
        <time className="time"
              dateTime={timestamp.toISOString()}>{timestamp.getHours()} : {timestamp.getMinutes()}</time>
        <span className="span__username">{username}</span>
        <span className="span__message">{text}</span>
      </div>
  );

}

export default MessageComponent;
