import React from "react";

// STYLES
import "./Servers.scss";
import serverIcon from "../../../../assets/servers/serverIcon.png";

// LIBRARIES

// CONSTANTS & MOCKS

// REDUX

// COMPONENTS

const Servers = () => {
  // PROPS

  // CONSTANTS USING LIBRARYS

  // CONSTANTS USING HOOKS

  // GENERAL CONSTANTS
  const serversModel = [
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
    { image: serverIcon },
  ];
  // USE EFFECT FUNCTION

  // REQUEST API FUNCTIONS

  // HANDLERS FUNCTIONS

  return (
    <div className="servers-container">
      {serversModel?.map((server, index) => (
        <div key={`server-${index}`} className="server-image-wrapper">
          <img src={server.image} alt="server image" />
        </div>
      ))}
    </div>
  );
};

export default Servers;
