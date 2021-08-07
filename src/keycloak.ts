import Keycloak from "keycloak-js";
import {authenticate, updateToken} from "./state-management/slices/keycloakSlice";
import socket from "./socketio";
import config from "./config";
import {store} from "./state-management/store";

// @ts-ignore
const keycloak: Keycloak.KeycloakInstance = new Keycloak(config.keycloak);

keycloak.onAuthRefreshSuccess = function () {
  socket.auth.token = keycloak.token;
  store.dispatch(updateToken(keycloak.token));
};

keycloak.onAuthSuccess = function () {
  socket.auth.token = keycloak.token;
  if (!socket.connected) socket.connect();
  store.dispatch(authenticate(keycloak.token));
};

export default keycloak;