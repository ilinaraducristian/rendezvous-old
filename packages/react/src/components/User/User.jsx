import React from "react";

// STYLES
import * as Styled from "./UserStyled";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const User = (props) => {
  // PROPS
  const { onClick = () => {}, styleType = "", icon = "", name = "", lastMessage = "" } = props;

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <Styled.UserWrapper
      onClick={() => {
        onClick(name);
      }}
    >
      <Styled.UserAvatarWrapper style={{ styleType }}>
        <Styled.UserAvatar src={icon} alt="user icon" />
      </Styled.UserAvatarWrapper>
      <Styled.UserInfo>
        <Styled.UserName>{name}</Styled.UserName>
        <Styled.UserLastMessage>{lastMessage}</Styled.UserLastMessage>
      </Styled.UserInfo>
    </Styled.UserWrapper>
  );
};

export default User;
