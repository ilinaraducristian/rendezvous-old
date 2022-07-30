// LIBRARIES
import styled, { css, keyframes } from "styled-components";

// container
export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// authentication wrapper
export const AuthenticationWrapper = styled.div(
  ({ style }) => css`
    width: ${style.isMobile ? "85%" : "50%"};
    height: ${style.isMobile ? "75%" : "60%"};
    display: flex;
    background: rgba(48, 39, 68, 0.24);
    border-radius: 1.4rem;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    z-index: 10;
    ${style.isMobile &&
    css`
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}
  `
);
export const AuthenticationInfo = styled.div(
  ({ style }) => css`
    width: 60%;
    height: 100%;
    border-top-left-radius: 1.6rem;
    border-bottom-left-radius: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    ${style.isMobile &&
    css`
      width: 100%;
      height: 20%;
      border-top-left-radius: 1.6rem;
      border-top-right-radius: 1.6rem;
      border-bottom-left-radius: 0rem;
    `}
  `
);

export const AuthenticationContent = styled.div(
  ({ style }) => css`
    width: 40%;
    height: 100%;
    background: #24213a;
    border-top-right-radius: 1.6rem;
    border-bottom-right-radius: 1.6rem;
    padding: 3rem;
    ${style.isMobile &&
    css`
      width: 100%;
      border-top-right-radius: 0rem;
      border-bottom-right-radius: 1.6rem;
      border-bottom-left-radius: 1.6rem;
    `}
  `
);
export const AuthenticationInfoBackground = styled.img`
  width: 60%;
  height: 100%;
  opacity: 20%;
  backdrop-filter: blur(5px);
  border-top-left-radius: 1.6rem;
  border-bottom-left-radius: 1.6rem;
  object-fit: cover;
  position: absolute;
  top: 0;
`;

export const AuthenticationLogo = styled.img(
  ({ style }) => css`
    width: 25rem;
    height: 25rem;
    filter: contrast(70%);
    ${style.isMobile &&
    css`
      width: 15rem;
      height: 15rem;
    `}
  `
);

export const FormWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const FormTitleWrapper = styled.div`
  width: 100%;
`;
export const FormTitle = styled.span(
  ({ style }) => css`
    font-size: ${style.isMobile ? "2rem" : "3rem"};
    font-weight: 800;
    color: white;
    opacity: 80%;
  `
);

export const InputsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 4rem;
`;
export const ButtonsWrapper = styled.div(
  ({ style }) => css`
    width: 100%;
    height: ${style.path === "WELCOME" ? "55%" : "20%"};
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `
);
export const LoginButton = styled.button(
  ({ style }) => css`
    font-size: ${style.isMobile ? "1.6rem" : "1.8rem"};
    background: transparent;
    border-radius: 0.5rem;
    color: white;
    border: 0.05rem solid white;
    padding: ${style.isMobile ? "0.5rem" : "0.8rem"} 0rem;
    font-weight: 600;
    cursor: pointer;
  `
);
export const RegisterButton = styled.button(
  ({ style }) => css`
    font-size: ${style.isMobile ? "1.6rem" : "1.8rem"};
    background: transparent;
    border-radius: 0.5rem;
    color: white;
    font-weight: 600;
    border: 0.05rem solid white;
    padding: ${style.isMobile ? "0.5rem" : "0.8rem"} 0rem;
    cursor: pointer;
  `
);

const showErrorAniamtion = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;
//
export const ErorrMessageWrapper = styled.div`
  position: relative;
  background: #af2824;
  text-align: right;
  min-width: 45%;
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #af2824;
  float: right;
  right: 20px;
  animation: ${showErrorAniamtion} 0.25s linear forwards;
  &::before {
    content: "";
    position: absolute;
    visibility: visible;
    top: -0.1rem;
    right: -1rem;
    border: 0.9rem solid transparent;
    border-top: 0.4rem solid #af2824;
  }

  &::after {
    content: "";
    position: absolute;
    visibility: visible;
    top: 0rem;
    right: -0.8rem;
    border: 1rem solid transparent;
    border-top: 1rem solid #af2824;
    clear: both;
  }
`;
export const ErrorMessage = styled.span(
  ({ style }) => css`
    font-size: ${style.isMobile ? "1.4rem" : "1.6rem"};
    color: white;
    font-weight: 600;
  `
);

export const ErrorMessageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  overflow: hidden;
`;

export const FormContent = styled.div(
  ({ style }) => css`
    width: 100%;
    height: ${style.path === "WELCOME" ? "25%" : style.path === "LOGIN" ? "35%" : "45%"};
    display: flex;
    flex-direction: column;
    margin-top: ${style.path === "WELCOME" ? "0rem" : "2rem"};
    ${style.isMobile &&
    css`
      height: ${style.path === "LOGIN" ? "37%" : "47%"};
    `}
  `
);
