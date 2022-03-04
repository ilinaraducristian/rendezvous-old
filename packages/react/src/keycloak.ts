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
  clientId: "rendezvous-client",
  realm: "rendezvous",
  url: "http://127.0.0.1:8080/auth",
}) as KeycloakType;

keycloak.onTokenExpired = async () => {
  await keycloak.updateToken(30);
  socketio.auth = { token: keycloak.token };
};

export default keycloak;
