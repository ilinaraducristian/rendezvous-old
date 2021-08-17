import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import {useAppDispatch} from "state-management/store";
import {
  deleteMessage as deleteMessageAction,
  editMessage as editMessageAction
} from "state-management/slices/serversSlice";
import {useLazyDeleteMessageQuery, useLazyEditMessageQuery} from "state-management/apis/socketio";
import config from "config";

type ComponentProps = {
  serverId: number,
  channelId: number,
  messageId: number,
  username: string,
  timestamp: string,
  text: string,
  isReply: boolean,
  replyId: number | null
  reply: any
}

function MessageComponent({
                            serverId,
                            channelId,
                            messageId,
                            username,
                            timestamp,
                            text,
                            isReply,
                            replyId,
                            reply
                          }: ComponentProps) {

  const time = new Date(timestamp);
  const [actions, setActions] = useState(false);
  const dispatch = useAppDispatch();
  const [fetchEditMessage, {
    isFetching: isFetchingEditMessage,
    isSuccess: isSuccessEditMessage
  }] = useLazyEditMessageQuery();
  const [fetchDeleteMessage, {
    isFetching: isFetchingDeleteMessage,
    isSuccess: isSuccessDeleteMessage
  }] = useLazyDeleteMessageQuery();
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const [oldMessage, setOldMessage] = useState("");

  function onMouseEnter() {
    setActions(true);
  }

  function onMouseLeave() {
    setActions(false);
  }

  function editMode() {
    if (isEditing) {
      if (textRef.current === null) return;
      textRef.current.innerText = oldMessage;
      setIsEditing(false);
    } else {
      if (textRef.current === null) return;
      setOldMessage(textRef.current.innerText);
      setIsEditing(true);
    }
  }

  function editMessage() {
    if (!config.offline) {
      fetchEditMessage({serverId, channelId, messageId, text: textRef.current?.innerText || ""});
    }
  }

  function deleteMessage() {
    if (!config.offline) {
      fetchDeleteMessage({serverId, channelId, messageId});
    } else {
      dispatch(deleteMessageAction({serverId, channelId, messageId}));
    }
  }

  useEffect(() => {
    if (!isSuccessEditMessage || isFetchingEditMessage) return;
    dispatch(editMessageAction({serverId, channelId, messageId, text: textRef.current?.innerText}));
    setIsEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessEditMessage, isFetchingEditMessage]);

  useEffect(() => {
    if (!isFetchingDeleteMessage || isSuccessDeleteMessage) return;
    dispatch(deleteMessageAction({serverId, channelId, messageId}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingDeleteMessage, isSuccessDeleteMessage]);

  return (
      <DivContainer onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {!actions ||
        <DivActions>
            <button type="button" onClick={editMode}>E</button>
            <button type="button" onClick={() => reply(messageId)}>R</button>
            <button type="button" onClick={deleteMessage}>D</button>
        </DivActions>
        }
        {
          !isReply ||
          <div>{
            replyId === null ?
                "message has been deleted"
                :
                `replied to ${replyId}`
          }</div>
        }
        <Div>
          <Time dateTime={time.toISOString()}>
            {time.getHours()} : {time.getMinutes()}
          </Time>
          <SpanUsername>{username}</SpanUsername>
          <DivMessageContainer>
            <SpanMessage suppressContentEditableWarning contentEditable={isEditing} ref={textRef}>{text}</SpanMessage>
            {
              !isEditing ||
              <button type="button" onClick={editMessage}>Save</button>
            }
          </DivMessageContainer>
        </Div>
      </DivContainer>
  );

}

/* CSS */

const DivMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DivContainer = styled.div`
  position: relative;
`;

const DivActions = styled.div`
  position: absolute;
  right: 1em;
  background: blue;
`;

const Div = styled.div`
  display: flex;
`;

const Time = styled.time`
  margin: 0 1em;
  flex-shrink: 0;
`;

const SpanUsername = styled.span`
  font-weight: 1000;
  flex-shrink: 0;
`;

const SpanMessage = styled.span`
  margin: 0 1em;
`;

/* CSS */

export default MessageComponent;
