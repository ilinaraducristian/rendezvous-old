const config = {
  keycloak: {
    authServerUrl: "http://localhost:8180/auth",
    tokenIntrospectionEndpoint: "http://localhost:8180/auth/realms/capp/protocol/openid-connect/token/introspect",
    realm: "capp",
    clientId: "token-introspection",
    secret: "6f41936d-afc4-48d5-bd70-36963fc393d6"
  }
};

export default config;
