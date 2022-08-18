import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// STYLES
import "./Login.scss";
import logo from "../../assets/login/logo.png";

// AXIOS
import { postData } from "../../config/axiosConfig";

// COMPONENTS
import Particle from "./components/Particle/Particle";
import Button from "./components/Button/Button";
import Input from "./components/Input/Input";

const Login = (props) => {
  // PROPS
  const { path = "" } = props;

  // CONSTANTS USING HOOKS
  const navigate = useNavigate();
  const [error, setError] = useState("Please complete all fields");
  const [showError, setShowError] = useState(false);
  const [buttonModel, setButtonModel] = useState([]);
  const [inputModel, setInputModel] = useState([]);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

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

  // REQUEST API FUNCTIONS
  const postRequest = async (address, data) => {
    const response = await postData(address, data);
    if (path === "login" && response.status !== 204) {
      setError("Invalid E-mail or Password");
      handleError();
    } else if (path === "register" && response.status !== 201) {
      setError("User already exist");
      handleError();
    } else {
      navigate("/app");
    }
  };

  // USE EFFECT FUNCTION
  useEffect(() => {
    const button = [
      {
        text: path === "/" ? "LOGIN" : path === "login" ? "CONNECT" : "CREATE ACCOUNT",
        path: path === "/" ? "/login" : path === "login" ? "/login" : "/login",
        type: "firstButton",
      },
      {
        text: path === "/" ? "REGISTER" : path === "register" ? "LOGIN" : "REGISTER",
        path: path === "/" ? "/register" : path === "register" ? "/login" : "/register",
        type: "secondButton",
      },
    ];
    const input = [
      {
        data: [
          {
            name: "username",
            label: "EMAIL",
            type: "text",
          },
          {
            name: "password",
            label: "PASSWORD",
            type: "password",
          },
        ],
      },
      {
        data: [
          {
            name: "name",
            label: "NAME",
            type: "text",
          },
          {
            name: "email",
            label: "EMAIL",
            type: "text",
          },
          {
            name: "password",
            label: "PASSWORD",
            type: "password",
          },
        ],
      },
    ];
    setLoginData({
      username: "",
      password: "",
    });
    setRegisterData({
      name: "",
      email: "",
      password: "",
    });
    setInputModel(input);
    setButtonModel(button);
    // eslint-disable-next-line
  }, [navigate]);

  // HANDLERS FUNCTIONS
  const handleClick = (address, type) => {
    if (path === "login" && type === "firstButton") {
      if (loginData.username !== "" && loginData.password !== "") {
        postRequest("/auth/login", loginData);
      } else {
        setError("Invalid E-mail or Password");
        handleError();
      }
    } else if (path === "register" && type === "firstButton") {
      if (registerData.name === "" && registerData.email === "" && registerData.password === "") {
        setError("Please complete all fields");
        handleError();
      } else if (registerData.name === "") {
        setError("Invalid Name");
        handleError();
      } else if (!registerData.email.includes("@")) {
        setError("Invalid E-mail");
        handleError();
      } else if (registerData.password === "") {
        setError("Invalid Password");
        handleError();
      } else {
        postRequest("/auth/register", registerData);
      }
    } else if (
      (path === "login" && type === "secondButton") ||
      (path === "register" && type === "secondButton") ||
      ((type === "firstButton" || type === "secondButton") && path === "/")
    ) {
      setShowError(false);
      navigate(address);
    }
  };

  const handleDisplayInput = (type) => {
    return inputModel[type]?.data?.map((input, index) => (
      <Input
        key={`input-${index}`}
        name={input.name}
        handleChange={(event) => {
          handleChange(event);
        }}
        value={path === "login" ? loginData[input.name] : registerData[input.name]}
        label={input.label}
        type={input.type}
      />
    ));
  };

  const handleChange = (event) => {
    if (path === "login") {
      setLoginData({
        ...loginData,
        [event.target.name]: event.target.value,
      });
    }
    if (path === "register") {
      setRegisterData({
        ...registerData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleError = () => {
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 1700);
  };

  return (
    <>
      <Particle />
      <div className="loginContainer">
        <div className="card">
          <form onSubmit={(event) => event.preventDefault()}>
            <div className="logoContainer">
              <img src={logo} alt="logo" />
            </div>
            <div className="credentialsContainer">
              <div className="titleWrapper">
                <p>{title()}</p>
              </div>
              <div className={path === "/" ? "introAuthenticationWrapper" : "authenticationWrapper"}>
                {path !== "/" && (
                  <div className="inputsWrapper">
                    {handleDisplayInput(path === "login" ? 0 : 1)}
                    <div className="forgotPasswordWrapper">{path === "login" && <span>Forgot your password?</span>}</div>
                    <div className="errorContainer">
                      {showError && (
                        <div className="errorMessageWrapper">
                          <span>{error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="buttonWrapper">
                  {buttonModel.map((button, index) => (
                    <Button key={`button-${index}`} text={button.text} handleClick={() => handleClick(button.path, button.type)} />
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
