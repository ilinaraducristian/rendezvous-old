const config = process.env.REACT_APP_ENVIRONMENT === "production" ? {
      offline: false,
      backend: "http://randevous.go.ro:8180/api",
      socketIoUrl: "http://randevous.go.ro:8180",
      keycloak: {
        url: "http://randevous.go.ro:8180/auth",
        realm: "capp",
        clientId: "auth-code",
      },
    }
    :
    {
      offline: false,
      backend: "http://localhost:3100",
      socketIoUrl: "http://localhost:3100",
      keycloak: {
        url: "http://localhost:8180/auth",
        realm: "capp",
        clientId: "auth-code",
      }
    };

export default config;
