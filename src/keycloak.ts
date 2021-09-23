import Keycloak from "keycloak-js";
import config from "config";

// @ts-ignore
const keycloak = new Keycloak(config.keycloak);
export default keycloak;