const config = process.env.REACT_APP_ENVIRONMENT === "production" ? {
      offline: false,
      backend: "http://rendezvous-api.zapto.org",
      socketIoUrl: "http://rendezvous-api.zapto.org",
      keycloak: {
        url: "http://rendezvous-api.zapto.org/auth",
        realm: "capp",
        clientId: "auth-code",
      },
    }
    :
    {
      offline: true,
      backend: "http://localhost:3100",
      socketIoUrl: "http://localhost:3100",
      keycloak: {
        url: "http://localhost:8180/auth",
        realm: "capp",
        clientId: "auth-code",
      }
    };

export default config;
