import Message from "../../entities/message";

type ComponentProps = { message: Message };

function MessageComponent({ message }: ComponentProps) {
  return (
    <li>
      <h5>{message.text}</h5>
      <button type="button" onClick={() => message.apiDelete()}>
        -M
      </button>
    </li>
  );
}

export default MessageComponent;
