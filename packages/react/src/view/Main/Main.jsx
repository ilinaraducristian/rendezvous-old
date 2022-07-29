import React, { useState, useEffect } from "react";

// STYLE
import * as Styled from "./MainStyled";

// LIBRARIES
import { isMobile, isBrowser } from "react-device-detect";

// COMPONENTS
import Servers from "../../sections/Servers/Servers";
import Users from "../../sections/Users/Users";
import Chat from "../../sections/Chat/Chat";

const Main = () => {
  // CONSTANTS USING HOOKS
  const [showChat, setShowChat] = useState(false);
  const [device, setDevice] = useState("");
  const [chatUserName, setChatUserName] = useState("");
  const [defaultChatLayout, setDefaultChatLayout] = useState(true);

  // Handle UseEffect
  useEffect(() => {
    if (isMobile) {
      setDevice("mobile");
    } else if (isBrowser) {
      setDevice("browser");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      window.innerWidth <= 576 ? setDevice("mobile") : setDevice("browser");
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);
  // HANDLE FUNCTIONS
  const handleClick = (userName) => {
    setShowChat(!showChat);
    setChatUserName(userName);
    if (device === "browser") {
      setDefaultChatLayout(false);
    }
  };

  const handleDisplayInterface = (display) => {
    switch (display) {
      case "mobile":
        return !showChat ? (
          <>
            <Styled.ServersWrapper style={{ display }}>
              <Servers styleType={display} />
            </Styled.ServersWrapper>
            <Styled.UsersWrapper style={{ display }}>
              <Users styleType={display} onClick={handleClick} />
            </Styled.UsersWrapper>
          </>
        ) : (
          <Styled.ChatWrapper style={{ display }}>
            <Chat styleType={display} userName={chatUserName} onClick={handleClick} />
          </Styled.ChatWrapper>
        );
      case "browser":
        return (
          <>
            <Styled.ServersWrapper style={{ display }}>
              <Servers styleType={display} />
            </Styled.ServersWrapper>
            <Styled.UsersWrapper style={{ display }}>
              <Users styleType={display} onClick={handleClick} />
            </Styled.UsersWrapper>
            <Styled.ChatWrapper style={{ display }}>
              {defaultChatLayout ? (
                <Styled.ChatDesktopLayout>
                  <Styled.LayoutIcon />
                </Styled.ChatDesktopLayout>
              ) : (
                <Chat styleType={display} userName={chatUserName} onClick={handleClick} />
              )}
            </Styled.ChatWrapper>
          </>
        );
      default:
        break;
    }
  };
  return <Styled.Container>{handleDisplayInterface(device)}</Styled.Container>;
};

export default Main;
