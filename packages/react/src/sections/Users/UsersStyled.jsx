// LIBRARIES
import styled, { css } from "styled-components";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StarRateIcon from "@mui/icons-material/StarRate";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0rem 1.1rem 0rem 1.1rem;
`;

export const UserListWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SearchWrapper = styled.div`
  width: 100%;
  height: 5%;
  margin: 2.5rem 0 1.5rem 0;
`;
export const Search = styled.input`
  width: 100%;
  height: 100%;
  background-color: transparent;
  outline: none;
  border: 0.1rem solid #ffffff5e;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  color: white;
  padding-left: 1.5rem;
  &::placeholder {
    font-size: 1.6rem;
    color: white;
    opacity: 80%;
  }
  &:focus::placeholder {
    color: transparent;
  }
`;
export const UserProfile = styled.div`
  width: 100%;
  margin: auto;
  height: 7%;
  background-color: #22222250;
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
  border-top: 0.05rem solid #ffffff29;
`;

export const UserIconsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5rem;
`;
export const ProfileIcon = styled(PersonIcon)`
  &.MuiSvgIcon-root {
    color: white;
    font-size: 2.5rem;
  }
`;
export const AddFriendIcon = styled(PersonAddIcon)`
  &.MuiSvgIcon-root {
    color: white;
    font-size: 2.5rem;
  }
`;
export const FavoriteContact = styled(StarRateIcon)`
  &.MuiSvgIcon-root {
    color: white;
    font-size: 2.5rem;
  }
`;
