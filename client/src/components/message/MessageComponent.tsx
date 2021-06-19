function MessageComponent({username, timestamp, text}: { username: string, timestamp: Date, text: string }) {
  return (
      <div id="message-container">
        {username}
        {timestamp.getHours()} : {timestamp.getMinutes()}
        {text}
      </div>
  );
}

export default MessageComponent;
