import React from "react";

// STYLES
import * as Styled from "./ChatStyled";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const Chat = (props) => {
  // PROPS
  const { onClick = () => {}, styleType = "", userName = "" } = props;
  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <Styled.Container style={{ styleType }}>
      <Styled.ChatHeader style={{ styleType }}>
        {styleType === "mobile" && (
          <Styled.ChatBackArrowWrapper onClick={() => onClick()}>
            <Styled.ChatBackArrow />
          </Styled.ChatBackArrowWrapper>
        )}
        <Styled.ChatNameWrapper style={{ styleType }}>
          <Styled.ChatName>{userName}</Styled.ChatName>
        </Styled.ChatNameWrapper>
      </Styled.ChatHeader>
      <Styled.ChatContent></Styled.ChatContent>
      <Styled.ChatMessage style={{ styleType }}>
        <Styled.SendMessageWrapper>
          <Styled.TextareaMessage style={{ styleType }} rows="5" cols="50" />
          <Styled.SendMessageIconWrapper>
            <Styled.SendMessageIcon />
          </Styled.SendMessageIconWrapper>
        </Styled.SendMessageWrapper>
      </Styled.ChatMessage>
    </Styled.Container>
  );
};

export default Chat;
