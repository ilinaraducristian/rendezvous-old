// LIBRARIES
import styled, { css } from "styled-components";

export const UserWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 1.1rem;
  border-radius: 0.5rem;
  background-color: #4b494c65;
  box-shadow: 0rem 0.1rem 0.15rem 0.01rem #8d868670;
  cursor: pointer;
`;
export const UserAvatarWrapper = styled.div(
  ({ style }) => css`
    width: ${style.styleType === "mobile" ? "20%" : "15%"};
    display: flex;
    align-items: center;
    justify-content: center;
  `
);
export const UserAvatar = styled.img`
  height: 4rem;
  width: 4rem;
`;
export const UserInfo = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
`;
export const UserName = styled.span`
  font-size: 1.6rem;
  color: white;
  font-weight: 600;
`;
export const UserLastMessage = styled.span`
  font-size: 1.4rem;
  color: #ffffff;
  opacity: 80%;
  font-weight: 400;
`;
