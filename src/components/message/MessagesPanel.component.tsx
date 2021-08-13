import {useEffect, useRef, useState} from "react";
import PlusSVG from "../../svg/Plus.svg";
import GIFSVG from "../../svg/GIF.svg";
import MessageComponent from "./Message.component";
import {useAppSelector} from "../../state-management/store";
import {selectMessages, selectUsers,} from "../../state-management/slices/serversDataSlice";
import EmojiContainerComponent from "./EmojiContainer.component";
import styled from "styled-components";
import MessageInputComponent from "./MessageInput.component";

function MessagesPanelComponent() {

  const messagesList = useRef<HTMLDivElement>(null);
  const messages = useAppSelector(selectMessages);
  const users = useAppSelector(selectUsers);
  const [shortcut, setShortcut] = useState<string | null>(null);
  const emojiRef = useRef<any>(null);

  useEffect(() => {
    messagesList.current?.scroll(0, messagesList.current.scrollHeight);
  }, [messages]);

  return (
      <DivBodyMain>
        <DivBodyMessages ref={messagesList}>
          <Ol className="list">
            {
              messages?.map(message =>
                  <MessageComponent key={`message_${message.id}`}
                                    username={users.find(user => user.id === message.userId)?.username || ""}
                                    text={message.text}
                                    timestamp={message.timestamp}
                  />
              )
            }
          </Ol>
        </DivBodyMessages>
        <EmojiContainerComponent ref={emojiRef} shortcut={shortcut}/>
        <Footer>
          <button type="button" className="btn btn--off btn--hover btn__icon">
            <PlusSVG/>
          </button>
          <MessageInputComponent emojiRef={emojiRef} setShortcut={setShortcut}/>
          <button type="button" className="btn btn--off btn--hover btn__icon">
            <GIFSVG/>
          </button>
          <button type="button" className="btn btn__icon">
            <Div/>
          </button>
        </Footer>
      </DivBodyMain>
  );

}

/* CSS */

const Ol = styled.ol`
  word-break: break-all;
`;

const Div = styled.div`
  background-image: url("assets/emojis.png");
  background-position: 0 0;
  background-size: 242px 110px;
  background-repeat: no-repeat;
  width: 22px;
  height: 22px;
  transform: scale(1);
  filter: grayscale(100%);

  &:hover {
    transform: scale(1.14);
    filter: grayscale(0%);
  }
`;

const DivBodyMain = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const DivBodyMessages = styled.div`
  flex-grow: 1;
  overflow-x: hidden;
`;

const Footer = styled.footer`
  background-color: var(--color-fifth);
  border-radius: 0.5em;
  max-height: 12.5em;
  margin: 0 1em 1.5em 1em;
  display: flex;
  align-items: flex-start;
`;

/* CSS */

export default MessagesPanelComponent;