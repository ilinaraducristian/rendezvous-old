import {useCallback, useEffect, useRef, useState} from "react";
import PlusSVG from "../../svg/Plus.svg";
import GIFSVG from "../../svg/GIF.svg";
import MessageComponent from "./Message.component";
import {useAppDispatch, useAppSelector} from "../../state-management/store";
import {
  addMessages,
  selectChannel as selectChannelAction,
  selectMessages,
  selectSelectedChannel,
  selectUsers,
} from "../../state-management/slices/serversSlice";
import EmojiContainerComponent from "./EmojiContainer.component";
import styled from "styled-components";
import MessageInputComponent from "./MessageInput.component";
import {useLazyGetMessagesQuery} from "../../state-management/apis/socketio";
import config from "../../config";

function MessagesPanelComponent() {

  const messagesList = useRef<HTMLDivElement>(null);
  const messages = useAppSelector(selectMessages);
  const users = useAppSelector(selectUsers);
  const channel = useAppSelector(selectSelectedChannel);
  const [shortcut, setShortcut] = useState<string | null>(null);
  const emojiRef = useRef<any>(null);
  const [fetch, {data, isSuccess, status}] = useLazyGetMessagesQuery();
  const dispatch = useAppDispatch();
  const [once, setOnce] = useState(false);
  // const [offset, setOffset] = useState(2040);
  const [offset, setOffset] = useState(0);
  const [beginning, setBeginning] = useState(false);

  useEffect(() => {
    messagesList.current?.scroll(0, messagesList.current.scrollHeight);
  }, [messages, once]);

  useEffect(() => {
    if (!isSuccess || status !== "fulfilled") return;
    if (channel === undefined || data === undefined) return;
    console.log(data);
    if (data.length === 0) {
      setBeginning(true);
      return;
    }
    dispatch(addMessages(data));
    dispatch(selectChannelAction(channel.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const onScroll = useCallback((event) => {
    if (channel === undefined) return;
    if (messagesList.current?.scrollTop === 0) {
      if (beginning) return;
      if (!config.offline) {
        console.log(offset);
        fetch({serverId: channel.serverId, channelId: channel.id, offset: offset});
        setOffset(offset + 30);
        return;
      }
    }
  }, [channel, fetch, offset, beginning]);

  return (
      <DivBodyMain>
        <DivBodyMessages ref={messagesList} onScroll={onScroll}>
          <Ol className="list">
            {//.sort((m1, m2) => Date.parse(m1.timestamp) - Date.parse(m2.timestamp))
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