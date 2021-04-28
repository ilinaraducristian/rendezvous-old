import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8180/auth',
    realm: 'CAPP',
    clientId: 'auth-code',
});

export default keycloak;
