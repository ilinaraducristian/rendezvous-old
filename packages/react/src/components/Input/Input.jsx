import React from "react";

// STYLES
import * as Styled from "./InputStyled";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const Input = (props) => {
  // PROPS
  const { onChange = () => {}, onKeyDown = () => {}, name = "", type = "", placeholder = "", value = "", style = "false" } = props;

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS
  // console.log(value);
  return <Styled.Input onChange={onChange} onKeyDown={onKeyDown} name={name} type={type} placeholder={placeholder} value={value} style={{ style }} />;
};

export default Input;
