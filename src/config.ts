import Keycloak from "keycloak-js";

const config = {
    offline: false,
    backend: "http://randevous.go.ro:8180/api",
    keycloakInstance: Keycloak({
        url: "http://randevous.go.ro:8180/auth",
        realm: "capp",
        clientId: "auth-code",
    })
};

export default config;
