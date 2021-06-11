import Keycloak from "keycloak-js";

const config = {
    backend: "http://localhost:3100",
    keycloakInstance: Keycloak({
        url: 'http://localhost:8180/auth',
        realm: 'CAPP',
        clientId: 'auth-code',
    })
};

export default config;
