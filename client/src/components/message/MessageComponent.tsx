type ComponentProps = {
  username: string,
  timestamp: Date,
  text: string
}

function MessageComponent({username, timestamp, text}: ComponentProps) {
  return (
      <div id="message-container">
        {username}
        {timestamp.getHours()} : {timestamp.getMinutes()}
        {text}
      </div>
  );
}

export default MessageComponent;
