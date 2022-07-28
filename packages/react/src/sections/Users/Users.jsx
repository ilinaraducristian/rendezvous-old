import React from "react";

// STYLES
import * as Styled from "./UsersStyled";
import userIcon from "../../assets/images/sections/users/userIcon.png";
// LIBRARIES

// REDUX

// COMPONENTS
import User from "../../components/User/User";

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
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
  {
    name: "Alex Marcel",
    lastMessage: "Nu am mai vz asa viata...",
  },
];

const Users = (props) => {
  // PROPS
  const { onClick = () => {}, styleType = "" } = props;

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <Styled.Container>
      <Styled.SearchWrapper>
        <Styled.Search placeholder="Search 🔍" />
      </Styled.SearchWrapper>
      <Styled.UserListWrapper>
        {usersModel?.map((user, index) => (
          <User key={`user-${index}`} onClick={onClick} styleType={styleType} icon={userIcon} name={user.name} lastMessage={user.lastMessage} />
        ))}
      </Styled.UserListWrapper>
      <Styled.UserProfile>
        <Styled.UserIconsWrapper>
          <Styled.ProfileIcon />
          <Styled.AddFriendIcon />
          <Styled.FavoriteContact />
        </Styled.UserIconsWrapper>
      </Styled.UserProfile>
    </Styled.Container>
  );
};

export default Users;
