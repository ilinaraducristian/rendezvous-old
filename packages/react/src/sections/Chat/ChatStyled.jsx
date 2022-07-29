// LIBRARIES
import styled, { css } from "styled-components";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";

// container
export const Container = styled.div(
  ({ style }) => css`
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
  `
);

// header
export const ChatHeader = styled.div(
  ({ style }) => css`
    width: 100%;
    height: 7%;
    background-color: #4b494c65;
    display: flex;
    align-items: center;
    border-top-left-radius: ${style.styleType === "browser" ? "1.5rem" : "0rem"};
    border-top-right-radius: ${style.styleType === "browser" ? "1.5rem" : "0rem"};
  `
);
export const ChatBackArrowWrapper = styled.div`
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const ChatBackArrow = styled(KeyboardBackspaceIcon)`
  &.MuiSvgIcon-root {
    font-size: 4rem;
    color: white;
    cursor: pointer;
  }
`;
export const ChatNameWrapper = styled.div(
  ({ style }) => css`
    width: 85%;
    padding-left: ${style.styleType === "browser" ? "3rem" : "0.1rem"};
  `
);
export const ChatName = styled.span`
  font-size: 2rem;
  color: white;
  font-weight: 600;
`;

// content
export const ChatContent = styled.div`
  width: 100%;
  height: 81%;
  background-color: #302a493d;
`;

// chat message
export const ChatMessage = styled.div(
  ({ style }) => css`
    width: 100%;
    height: 12%;
    background-color: #4b494c65;
    border-bottom-left-radius: ${style.styleType === "browser" ? "1.5rem" : "0rem"};
    border-bottom-right-radius: ${style.styleType === "browser" ? "1.5rem" : "0rem"};
  `
);
export const SendMessageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
`;
export const TextareaMessage = styled.textarea(
  ({ style }) => css`
    width: ${style.styleType === "browser" ? "90%" : "85%"};
    height: 100%;
    border-width: 0;
    outline: none;
    background-color: #4b494c65;
    border-radius: 1rem;
    font-size: 1.6rem;
    color: white;
    padding: 1rem;
    resize: none;
    &::-webkit-scrollbar {
      display: none;
    }
  `
);
export const SendMessageIconWrapper = styled.div`
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const SendMessageIcon = styled(SendIcon)`
  &.MuiSvgIcon-root {
    font-size: 3rem;
    color: white;
    cursor: pointer;
  }
`;
