import fetch from "node-fetch";

function socketioKeycloakAuth(options) {
    return (socket, next) => {
        const token = socket.handshake.auth.token;
        fetch(options.tokenIntrospectionEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `token=${token}&client_id=${options.clientId}&client_secret=${options.clientSecret}`
        })
            .then(response => response.json())
            .then(response => {
                if (!response.active) {
                    console.log('invalid token');
                    return next(new Error('Invalid token'));
                }
                socket.handshake.auth.username = response.username;
                socket.handshake.auth.userId = response.sub;
                next();
            })
            .catch(err => {
                console.log('Keycloak token introspection error:');
                console.log(err);
                next(new Error('500 Internal Server Error'));
            });
    };

}

export default socketioKeycloakAuth;
