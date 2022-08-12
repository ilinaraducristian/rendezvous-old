import React from "react";

// STYLES
import "./Input.scss";

// LIBRARIES
import PropTypes from "prop-types";

const Input = (props) => {
  // PROPS
  const { name = "", handleChange = () => {}, label = "", type = "", value = "" } = props;

  return (
    <div className="textInput-container">
      <label>{label}</label>
      <input name={name} onChange={(event) => handleChange(event)} type={type} value={value} />
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  handleChange: PropTypes.func,
};

export default Input;
