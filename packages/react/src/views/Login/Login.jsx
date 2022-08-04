import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// STYLES
import styles from "./Login.module.scss";
import logo from "../../assets/login/logo.png";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS
import Particle from "./components/Particle/Particle";
import Button from "./components/Button/Button";
import Input from "./components/Input/Input";

const Login = (props) => {
  // PROPS
  const { path = "" } = props;

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS
  const navigate = useNavigate();
  const [error, setError] = useState("Please complete all fields");
  const [showError, setShowError] = useState(true);
  const [buttonModel, setButtonModel] = useState([]);
  const [inputModel, setInputModel] = useState([]);

  // GENERAL CONSTANTS
  const title = () => {
    switch (path) {
      case "/":
        return "WELCOME";
      case "login":
        return "LOGIN";
      case "register":
        return "REGISTER";
      default:
        break;
    }
  };

  // USE EFFECT FUNCTION
  useEffect(() => {
    const button = [
      {
        text: path === "/" ? "LOGIN" : path === "login" ? "CONNECT" : "CREATE ACCOUNT",
        path: path === "/" ? "/login" : path === "login" ? "/login" : "/login",
      },
      {
        text: path === "/" ? "REGISTER" : path === "register" ? "LOGIN" : "REGISTER",
        path: path === "/" ? "/register" : path === "register" ? "/login" : "/register",
      },
    ];
    const input = [
      {
        data: [
          {
            label: "EMAIL",
            type: "text",
          },
          {
            label: "PASSWORD",
            type: "password",
          },
        ],
      },
      {
        data: [
          {
            label: "NAME",
            type: "text",
          },
          {
            label: "EMAIL",
            type: "text",
          },
          {
            label: "PASSWORD",
            type: "password",
          },
        ],
      },
    ];
    setInputModel(input);
    setButtonModel(button);
  }, [navigate]);

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const handleClick = (path) => {
    navigate(path);
  };
  const displayInput = (type) => {
    return inputModel[type]?.data?.map((input, index) => (
      <Input
        handleChange={() => {
          console.log("login");
        }}
        label={input.label}
        type={input.type}
      />
    ));
  };
  return (
    <>
      <Particle />
      <div className={styles.loginContainer}>
        <div className={styles.card}>
          <form onSubmit={handleSubmit}>
            <div className={styles.logoContainer}>
              <div className={styles.logoWrapper}>
                <img src={logo} alt="logo" />
              </div>
            </div>
            <div className={styles.credentialsContainer}>
              <div className={styles.titleWrapper}>
                <p>{title()}</p>
              </div>
              <div className={styles.authenticationWrapper}>
                {path !== "/" && (
                  <div className={styles.inputsWrapper}>
                    {displayInput(path === "login" ? 0 : 1)}
                    <div className={styles.forgotPasswordWrapepr}>{path === "login" && <span>Forgot your password?</span>}</div>
                    <div className={styles.errorContainer}>
                      {showError && (
                        <div className={styles.errorMessageWrapper}>
                          <span>{error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className={styles.buttonWrapper}>
                  {buttonModel.map((button, index) => (
                    <Button key={`button-${index}`} style="basic" text={button.text} handleClick={() => handleClick(button.path)} />
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
