import React from "react";

// STYLES
import "./Button.scss";

// LIBRARIES
import PropTypes from "prop-types";

const Button = (props) => {
  // PROPS
  const { handleClick = () => {}, text = "" } = props;

  return (
    <button className="basic" onClick={() => handleClick()}>
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
