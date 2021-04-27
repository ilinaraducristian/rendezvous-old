const config = {
    keycloak: {
        base_url: 'http://localhost:8180',
        token_introspection_endpoint: 'http://localhost:8180/auth/realms/CAPP/protocol/openid-connect/token/introspect',
        client_id: 'token-inspection',
        client_secret: '08a8b10b-d473-42b6-98c7-901392bc4e4b'
    }
};

export default config;
