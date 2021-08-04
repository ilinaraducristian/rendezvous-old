type ComponentProps = {
  username: string,
  timestamp: string,
  text: string
}

function MessageComponent({username, timestamp, text}: ComponentProps) {

  const time = new Date(timestamp);

  return (
      <div className="message-container">
        <time className="time"
              dateTime={time.toISOString()}>{time.getHours()} : {time.getMinutes()}</time>
        <span className="span__username">{username}</span>
        <span className="span__message">{text}</span>
      </div>
  );

}

export default MessageComponent;
