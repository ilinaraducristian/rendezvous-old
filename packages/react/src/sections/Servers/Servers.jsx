import React from 'react';

// STYLES
import * as Styled from "./ServerStyled"
import serverIcon from "../../assets/images/sections/servers/serverIcon.png"

// LIBRARIES

// CONSTANTS & MOCKS
const serversModel = [{image: serverIcon},{image: serverIcon},{image: serverIcon}]
// REDUX

// COMPONENTS

const Servers = (props) => {
  // PROPS
  const {
    styleType = ""
  } = props
  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS 

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS
  return <Styled.Container style={{styleType}}>
    {serversModel?.map((server, index) => (
      <Styled.ServerIconWrapper key={`server-${index}`}>
         <Styled.ServerIcon src={server.image}/>
      </Styled.ServerIconWrapper>
     
    ))}
  </Styled.Container>
}

export default Servers;