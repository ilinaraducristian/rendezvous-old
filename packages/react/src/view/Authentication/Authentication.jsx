import React from "react";

// STYLES
import * as Styled from "./AuthenticationStyled";
import background from "../../assets/images/authentication/background.jpg";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS
import Particle from "./Particle/Particle";
const Authentication = () => {
  // PROPS

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <>
      <Styled.Container>
        <Styled.AuthenticationWrapper>
          <Styled.AuthenticationInfo>{/* <Styled.AuthenticationInfoBackground src={background} /> */}</Styled.AuthenticationInfo>
          <Styled.AuthenticationContent></Styled.AuthenticationContent>
        </Styled.AuthenticationWrapper>
      </Styled.Container>
      <Particle />
    </>
  );
};

export default Authentication;
