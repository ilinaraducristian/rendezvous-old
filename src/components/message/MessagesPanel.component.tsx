import {useCallback, useEffect, useRef, useState} from "react";
import MessageComponent from "components/message/Message.component";
import {useAppDispatch, useAppSelector} from "state-management/store";
import {addMessages, selectChannel as selectChannelAction,} from "state-management/slices/data/data.slice";
import styled from "styled-components";
import {useLazyGetMessagesQuery} from "state-management/apis/socketio";
import config from "config";
import MessageInputContainerComponent from "components/message/MessageInputContainer.component";
import {selectSelectedChannel, selectUsers} from "state-management/selectors/data.selector";
import {selectSelectedChannelMessages} from "state-management/selectors/channel.selector";

function MessagesPanelComponent() {

  const messagesList = useRef<HTMLDivElement>(null);
  const messages = useAppSelector(selectSelectedChannelMessages);
  const users = useAppSelector(selectUsers);
  const channel = useAppSelector(selectSelectedChannel);
  const [fetch, {data, isSuccess, status}] = useLazyGetMessagesQuery();
  const dispatch = useAppDispatch();
  // const [offset, setOffset] = useState(2040);
  const [offset, setOffset] = useState(0);
  const [beginning, setBeginning] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyId, setReplyId] = useState<number | undefined>();

  useEffect(() => {
    messagesList.current?.scroll(0, messagesList.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    if (!isSuccess || status !== "fulfilled") return;
    if (channel === undefined || data === undefined) return;

    if (data.length === 0) {
      setBeginning(true);
      return;
    }
    dispatch(addMessages(data));
    dispatch(selectChannelAction(channel.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const onScroll = useCallback(() => {
    if (channel === undefined) return;
    if (messagesList.current?.scrollTop === 0) {
      if (beginning) return;
      if (!config.offline) {
        fetch({serverId: channel.serverId, channelId: channel.id, offset: offset});
        setOffset(offset + 30);
        return;
      }
    }
  }, [channel, fetch, offset, beginning]);

  function reply(messageId: number) {
    setReplyId(messageId);
    setIsReplying(true);
  }

  function messageSent() {
    setReplyId(undefined);
    setIsReplying(false);
  }

  return (
      <DivBodyMain>
        <DivBodyMessages ref={messagesList} onScroll={onScroll}>
          <Ol className="list">
            {//.sort((m1, m2) => Date.parse(m1.timestamp) - Date.parse(m2.timestamp))
              messages.map(message =>
                  <MessageComponent key={`message_${message.id}`}
                                    serverId={message.serverId}
                                    channelId={message.channelId}
                                    messageId={message.id}
                                    username={users.find(user => user.id === message.userId)?.username || ""}
                                    text={message.text}
                                    timestamp={message.timestamp}
                                    isReply={message.isReply}
                                    replyId={message.replyId}
                                    reply={reply}
                  />
              ).sort((a, b) => Date.parse(a.props.timestamp) - Date.parse(b.props.timestamp))
            }
          </Ol>
        </DivBodyMessages>
        {
          !isReplying ||
          <div>replying</div>
        }
        <MessageInputContainerComponent isReplying={isReplying} replyId={replyId} messageSent={messageSent}/>
      </DivBodyMain>
  );

}

/* CSS */

const Ol = styled.ol`
  word-break: break-all;
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

/* CSS */

export default MessagesPanelComponent;