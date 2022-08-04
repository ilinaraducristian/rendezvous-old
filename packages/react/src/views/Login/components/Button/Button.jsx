import React from "react";

// STYLES
import "./Button.scss";

// LIBRARIES
import PropTypes from "prop-types";

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const Button = (props) => {
  // PROPS
  const { handleClick = () => {}, text = "", style = "" } = props;

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS

  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS
  return (
    <button className={style} onClick={() => handleClick()}>
      {text}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  style: PropTypes.string,
};

export default Button;
