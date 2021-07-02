type ComponentProps = {
  username: string,
  timestamp: Date,
  text: string
}

function MessageComponent({username, timestamp, text}: ComponentProps) {
  return (
      <div className="message-container">
        {username}
        {timestamp.getHours()} : {timestamp.getMinutes()}
        {text}
      </div>
  );
}

export default MessageComponent;
