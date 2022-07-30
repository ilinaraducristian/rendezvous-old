// LIBRARIES
import styled, { css } from "styled-components";
import MessageIcon from "@mui/icons-material/Message";

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
    background-color: #22222250;
    border-top-right-radius: 1rem;
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
    ${console.log(style)}
    width: 100%;
    height: 100%;
    padding: ${style.display === "browser" ? "1rem" : "0rem"};
  `
);

export const ChatDesktopLayout = styled.div`
  width: 100%;
  height: 100%;
  background-color: #302a493d;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LayoutIcon = styled(MessageIcon)`
  &.MuiSvgIcon-root {
    color: #ffffff9e;
    font-size: 15rem;
  }
`;
