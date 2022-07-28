import React from "react";

// STYLES
import * as Styled from "./UsersStyled";
import userIcon from "../../assets/images/sections/users/userIcon.png";
// LIBRARIES

// CONSTANTS & MOCKS
const usersModel = [
  {
    name: "Gigle Mirel",
    lastMessage: "Esti jmeker cel mai tare ",
  },
  {
    name: "Ion Marcel",
    lastMessage: "Cumpara paine saraqieeee ",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa ceva in viata...",
  },
];

// REDUX

// COMPONENTS

const Users = (props) => {
  const { onClick = () => {}, styleType = "" } = props;
  // PROPS

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <Styled.Container>
      {usersModel?.map((user, index) => (
        <Styled.UserWrapper
          onClick={() => {
            onClick(user.name);
          }}
          key={`user-${index}`}
        >
          <Styled.UserAvatarWrapper style={{ styleType }}>
            <Styled.UserAvatar src={userIcon} alt="user icon" />
          </Styled.UserAvatarWrapper>
          <Styled.UserInfo>
            <Styled.UserName>{user.name}</Styled.UserName>
            <Styled.UserLastMessage>{user.lastMessage}</Styled.UserLastMessage>
          </Styled.UserInfo>
        </Styled.UserWrapper>
      ))}
    </Styled.Container>
  );
};

export default Users;
