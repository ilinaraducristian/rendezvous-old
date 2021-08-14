import styled from "styled-components";
import {useEffect, useState} from "react";
import {useAppDispatch} from "../../state-management/store";
import {deleteMessage as deleteMessageAction} from "../../state-management/slices/serversSlice";
import {useLazyDeleteMessageQuery} from "../../state-management/apis/socketio";
import config from "../../config";

type ComponentProps = {
  serverId: number,
  channelId: number,
  messageId: number,
  username: string,
  timestamp: string,
  text: string
}

function MessageComponent({serverId, channelId, messageId, username, timestamp, text}: ComponentProps) {

  const time = new Date(timestamp);
  const [actions, setActions] = useState(false);
  const dispatch = useAppDispatch();
  const [fetch, {isFetching, isSuccess}] = useLazyDeleteMessageQuery();

  function onMouseEnter() {
    setActions(true);
  }

  function onMouseLeave() {
    setActions(false);
  }

  function editMessage() {

  }

  function deleteMessage() {
    if (!config.offline) {
      fetch({serverId, channelId, messageId});
    } else {
      dispatch(deleteMessageAction({serverId, channelId, messageId}));
    }
  }

  useEffect(() => {
    console.log({isSuccess, isFetching});
    if (!isSuccess || isFetching) return;
    dispatch(deleteMessageAction({serverId, channelId, messageId}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isFetching]);

  return (
      <DivContainer onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {!actions ||
        <DivActions>
            <button type="button" onClick={editMessage}>E</button>
            <button type="button" onClick={deleteMessage}>D</button>
        </DivActions>
        }
        <Div>
          <Time dateTime={time.toISOString()}>
            {time.getHours()} : {time.getMinutes()}
          </Time>
          <SpanUsername>{username}</SpanUsername>
          <SpanMessage>{text}</SpanMessage>
        </Div>
      </DivContainer>
  );

}

/* CSS */

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
