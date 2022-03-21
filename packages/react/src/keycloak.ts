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

function newKeycloak() {
  if(process.env.NODE_ENV === 'production') return Keycloak({
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || '',
    realm: process.env.REACT_APP_KEYCLOAK_REALM || '',
    url: process.env.REACT_APP_KEYCLOAK_URL,
  }) as KeycloakType;
  return {
    onTokenExpired: () => {},
    updateToken: () => {},
    token: '123456789',
    init: () => true,
    login: () => true,
    loadUserInfo: () => {},
    subject: 'user1',
    userInfo: {
      preferred_username: 'user1'
    }
  } as unknown as KeycloakType
}

const keycloak = newKeycloak();

keycloak.onTokenExpired = async () => {
  await keycloak.updateToken(30);
  (socketio.auth as any).token = keycloak.token;
};

export default keycloak;
