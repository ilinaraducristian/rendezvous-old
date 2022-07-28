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
    <Styled.Container>
      <Styled.ChatHeader>
        {styleType === "mobile" && (
          <Styled.ChatBackArrowWrapper onClick={() => onClick()}>
            <Styled.ChatBackArrow />
          </Styled.ChatBackArrowWrapper>
        )}
        <Styled.ChatNameWrapper>
          <Styled.ChatName>{userName}</Styled.ChatName>
        </Styled.ChatNameWrapper>
      </Styled.ChatHeader>
      <Styled.ChatContent></Styled.ChatContent>
      <Styled.ChatMessage></Styled.ChatMessage>
    </Styled.Container>
  );
};

export default Chat;
