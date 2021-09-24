const config = process.env.REACT_APP_ENVIRONMENT === "production" ? {
        production: true,
        offline: false,
        backend: "https://rendezvous.myddns.me:30000/api",
        socketIoUrl: "https://rendezvous.myddns.me:30000",
        keycloak: {
            url: "https://rendezvous.myddns.me:30000/auth",
            realm: "capp",
            clientId: "auth-code",
        },
    }
    :
    {
        production: false,
        offline: true,
        backend: "http://localhost:3100",
        socketIoUrl: "http://localhost:3100",
        keycloak: {
            url: "http://localhost:8080/auth",
            realm: "capp",
            clientId: "auth-code",
        }
    };

export default config;
