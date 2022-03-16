import Keycloak, { KeycloakInstance } from "keycloak-js";
import socketio from "./socket.io";

type KeycloakType = KeycloakInstance & {
  userInfo?: {
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
  };
};

const keycloak = Keycloak({
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || '',
  realm: process.env.REACT_APP_KEYCLOAK_REALM || '',
  url: process.env.REACT_APP_KEYCLOAK_URL,
}) as KeycloakType;

keycloak.onTokenExpired = async () => {
  await keycloak.updateToken(30);
  socketio.auth = { token: keycloak.token };
};

export default keycloak;
