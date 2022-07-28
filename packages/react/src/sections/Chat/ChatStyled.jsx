// LIBRARIES
import styled from "styled-components";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

// container
export const Container = styled.div`
  width:100%;
  height:100vh;
  
`;

// header
export const ChatHeader = styled.div`
  width:100%;
  height:6%;
  background-color:#676767;
  display:flex;
  align-items:center;
`;
export const ChatBackArrowWrapper = styled.div`
  width:15%;
  display:flex;
  align-items:center;
  justify-content:center;
`;
export const ChatBackArrow = styled(KeyboardBackspaceIcon)`
  &.MuiSvgIcon-root{
    font-size: 4rem;
    color:white;
    cursor:pointer;
  }
`;
export const ChatNameWrapper = styled.div`
   width:85%;
   padding-left:10px;
`;
export const ChatName = styled.span`
  font-size:1.8rem;
  color:white;
  font-weight:600;
`;

// content
export const ChatContent = styled.div`
  width:100%;
  height:90%;
  background-color:#d9d9d9;
`;

// footer
export const ChatMessage = styled.div`
   width:100%;
   height:4%;
   background-color:#676767;
`;