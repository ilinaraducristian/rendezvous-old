const config = {
  keycloak: {
    authServerUrl: "http://localhost:8180/auth",
    tokenIntrospectionEndpoint: "http://localhost:8180/auth/realms/CAPP/protocol/openid-connect/token/introspect",
    realm: "CAPP",
    clientId: "token-inspection",
    secret: "08a8b10b-d473-42b6-98c7-901392bc4e4b"
  }
};

export default config;
