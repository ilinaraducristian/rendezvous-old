// LIBRARIES
import styled from "styled-components";

// container
export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// authentication wrapper
export const AuthenticationWrapper = styled.div`
  width: 50%;
  height: 60%;
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 10;
`;
export const AuthenticationInfo = styled.div`
  width: 60%;
  height: 100%;
  border-top-left-radius: 1.6rem;
  border-bottom-left-radius: 1.6rem;
`;

export const AuthenticationContent = styled.div`
  width: 40%;
  height: 100%;
  background: #1a1829;
  border-top-right-radius: 1.6rem;
  border-bottom-right-radius: 1.6rem;
`;
export const AuthenticationInfoBackground = styled.img`
  width: 100%;
  height: 100%;
  opacity: 20%;
  backdrop-filter: blur(5px);
  border-top-left-radius: 1.6rem;
  border-bottom-left-radius: 1.6rem;
  object-fit: cover;
`;
