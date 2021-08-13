import styled from "styled-components";

type ComponentProps = {
  username: string,
  timestamp: string,
  text: string
}

function MessageComponent({username, timestamp, text}: ComponentProps) {

  const time = new Date(timestamp);

  return (
      <Div>
        <Time dateTime={time.toISOString()}>
          {time.getHours()} : {time.getMinutes()}
        </Time>
        <SpanUsername>{username}</SpanUsername>
        <SpanMessage>{text}</SpanMessage>
      </Div>
  );

}

/* CSS */

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
