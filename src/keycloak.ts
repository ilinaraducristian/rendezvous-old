import Keycloak from "keycloak-js";
import {keycloakSlice} from "./state-management/slices/keycloakSlice";
import socket from "./socketio";

// @ts-ignore
const keycloak: Keycloak.KeycloakInstance = new Keycloak({url: "a", clientId: "", realm: ""});

keycloak.onAuthRefreshSuccess = function () {
  socket.auth.token = keycloak.token;
  keycloakSlice.actions.updateToken(keycloak.token);
};

keycloak.onAuthSuccess = function () {
  socket.auth.token = keycloak.token;
  if (!socket.connected) socket.connect();
  keycloakSlice.actions.authenticate(keycloak.token);
};

export default keycloak;