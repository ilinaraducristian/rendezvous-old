// LIBRARIES
import styled, { css } from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

export const UserWrapper = styled.div`
  width: 100%;
  display: flex;
  padding-top: 2rem;
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
`;
export const UserName = styled.span`
  font-size: 1.6rem;
  color: white;
  font-weight: 600;
`;
export const UserLastMessage = styled.span`
  font-size: 1.6rem;
  color: #ffffff;
  opacity: 80%;
  font-weight: 600;
`;
