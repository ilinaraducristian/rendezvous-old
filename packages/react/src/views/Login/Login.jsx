import React from "react";

// STYLES
import styles from "./Login.module.scss";
import logo from "../../assets/login/logo.png";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS
import Particle from "./components/Particle/Particle";

const Login = (props) => {
  // PROPS
  const { path = "" } = props;

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

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

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <>
      <Particle />
      <div className={styles.loginContainer}>
        <div className={styles.card}>
          <form>
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
                <div className={styles.inputsWrapper}></div>
                <div className={styles.buttonWrapper}></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
