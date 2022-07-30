import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// STYLES
import * as Styled from "./AuthenticationStyled";
import background from "../../assets/images/authentication/background.jpg";
import logo from "../../assets/images/authentication/logo.png";

// LIBRARIES
import { isMobile } from "react-device-detect";

// REDUX

// COMPONENTS
import Particle from "./Particle/Particle";
import Input from "../../components/Input/Input";

const Authentication = (props) => {
  // PROPS
  const { path = "" } = props;

  // CONSTANTS USING LIBRARYS
  const navigate = useNavigate();

  // CONSTANTS USING HOOKS
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const credentials = {
    email: "chat-app@build.com",
    password: "parola123",
  };

  // GENERAL CONSTANTS
  const loginModel = [
    {
      name: "email",
      type: "text",
      placeholder: "E-mail",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
    },
  ];
  const registerModel = [
    {
      name: "userName",
      type: "text",
      placeholder: "Name",
    },
    {
      name: "email",
      type: "text",
      placeholder: "E-mail",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
    },
  ];

  // USE EFFECT FUNCTION
  useEffect(() => {
    setTitle(path);
    if (path === "LOGIN") {
      setData(loginModel);
      setLoginData({
        email: "",
        password: "",
      });
    }
    if (path === "REGISTER") {
      setData(registerModel);
      setRegisterData({
        userName: "",
        email: "",
        password: "",
      });
    }
    setShowErrorMessage(false);
  }, [navigate]);

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS
  const handleInputValue = (event) => {
    if (path === "LOGIN") {
      setLoginData({
        ...loginData,
        [event.target.name]: event.target.value,
      });
    }
    if (path === "REGISTER") {
      setRegisterData({
        ...registerData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleClick = (type) => {
    if (type === "login") {
      if (path === "WELCOME") {
        navigate("/login");
      }
      if (path === "REGISTER") {
        handleConnect();
      }
      if (handleText("login") === "CONNECT") {
        handleConnect();
      }
    }
    if (type === "register") {
      if (path === "WELCOME" || path === "LOGIN") {
        navigate("/register");
      }
      if (handleText("register") === "LOGIN") {
        navigate("/login");
      }
    }
  };
  const handleText = (type) => {
    if ((type === "login" && path === "WELCOME") || (type === "register" && path === "REGISTER")) {
      return "LOGIN";
    }
    if ((type === "register" && path === "WELCOME") || (type === "register" && path === "LOGIN")) {
      return "REGISTER";
    }
    if (type === "login" && path === "LOGIN") {
      return "CONNECT";
    }
    if (type === "login" && path === "REGISTER") {
      return "CREATE ACCOUNT";
    }
  };
  const handleConnect = () => {
    if (credentials.email === loginData.email && credentials.password === loginData.password) {
      navigate("/app");
    } else if (path === "LOGIN") {
      handleError();
      setError("Invalid E-mail or Password");
    } else if (path === "REGISTER") {
      if (registerData.userName === "" && registerData.email === "" && registerData.password === "") {
        handleError();
        setError("Please complete all fields");
      } else if (registerData.userName === "") {
        handleError();
        setError("Invalid Name");
      } else if (!registerData.email.includes("@")) {
        handleError();
        setError("Invalid E-mail");
      } else if (registerData.password === "") {
        handleError();
        setError("Invalid Password");
      }
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleConnect();
    }
  };
  const handleError = () => {
    setShowErrorMessage(true);
    setTimeout(() => {
      setShowErrorMessage(false);
    }, 1700);
  };

  return (
    <>
      <Styled.Container>
        <Styled.AuthenticationWrapper style={{ isMobile }}>
          <Styled.AuthenticationInfo style={{ isMobile }}>
            <Styled.AuthenticationLogo src={logo} alt="logo" style={{ isMobile }} />
            {!isMobile && <Styled.AuthenticationInfoBackground src={background} />}
          </Styled.AuthenticationInfo>

          <Styled.AuthenticationContent style={{ isMobile }}>
            <Styled.FormWrapper>
              <Styled.FormTitleWrapper>
                <Styled.FormTitle style={{ isMobile }}>{title}</Styled.FormTitle>
              </Styled.FormTitleWrapper>
              <Styled.FormContent style={{ path, isMobile }}>
                {data.length > 0 && (
                  <Styled.InputsWrapper>
                    {data?.map((element, index) => {
                      return (
                        <Input
                          key={`input-${index}`}
                          name={element.name}
                          value={path === "LOGIN" ? loginData[element.name] : registerData[element.name]}
                          type={element.type}
                          placeholder={element.placeholder}
                          onChange={(event) => handleInputValue(event)}
                          onKeyDown={(event) => handleKeyDown(event)}
                          style={isMobile}
                        />
                      );
                    })}
                  </Styled.InputsWrapper>
                )}
                <Styled.ErrorMessageContainer>
                  {showErrorMessage && (
                    <Styled.ErorrMessageWrapper>
                      <Styled.ErrorMessage style={{ isMobile }}>{error}</Styled.ErrorMessage>
                    </Styled.ErorrMessageWrapper>
                  )}
                </Styled.ErrorMessageContainer>
              </Styled.FormContent>
              <Styled.ButtonsWrapper style={{ path }}>
                <Styled.LoginButton onClick={() => handleClick("login")} style={{ isMobile }}>
                  {handleText("login")}
                </Styled.LoginButton>
                <Styled.RegisterButton onClick={() => handleClick("register")} style={{ isMobile }}>
                  {handleText("register")}
                </Styled.RegisterButton>
              </Styled.ButtonsWrapper>
            </Styled.FormWrapper>
          </Styled.AuthenticationContent>
        </Styled.AuthenticationWrapper>
      </Styled.Container>
      <Particle />
    </>
  );
};

export default Authentication;
