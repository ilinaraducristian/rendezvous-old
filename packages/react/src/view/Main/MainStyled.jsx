// LIBRARIES
import styled, { css } from "styled-components";

// constainer
export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

export const ServersWrapper = styled.div(
  ({ style }) => css`
    ${style.display === "mobile" &&
    css`
      width: 15%;
      height: 100%;
      background-color: #c5c1c1;
    `}
    ${style.display === "browser" &&
    css`
      width: 6%;
      height: 100%;
      background-color: #c5c1c1;
    `}
  `
);

export const UsersWrapper = styled.div(
  ({ style }) => css`
    ${style.display === "mobile" &&
    css`
      width: 85%;
      height: 100%;
      background-color: #8f8f8f;
    `}
    ${style.display === "browser" &&
    css`
      width: 25%;
      height: 100%;
      background-color: #8f8f8f;
    `}
  `
);

export const ChatWrapper = styled.div(
  ({ style }) => css`
    width: 100%;
    height: 100%;
  `
);

export const ChatDesktopLayout = styled.div`
  width: 100%;
  height: 100%;
  background-color: #585050;
`;
