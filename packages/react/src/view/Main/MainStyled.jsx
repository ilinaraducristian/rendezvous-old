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
    height: 100%;
    border-right: 0.05rem solid #ffffff29;
    background-color: #402d8528;
    border-top-right-radius: 1rem;
    ${style.display === "mobile" &&
    css`
      width: 15%;
    `}
    ${style.display === "browser" &&
    css`
      width: 6%;
    `}
  `
);

export const UsersWrapper = styled.div(
  ({ style }) => css`
    height: 100%;
    ${style.display === "mobile" &&
    css`
      width: 85%;
    `}
    ${style.display === "browser" &&
    css`
      width: 25%;
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
