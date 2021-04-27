function socketioKeycloakAuth(options) {

    return (socket, next) => {
        const token = socket.handshake.auth.token;
        fetch(options.token_introspection_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `token=${token}&client_id=${options.client_id}&client_secret=${options.client_secret}`
        })
            .then(response => response.json())
            .then(response => {
                if (!response.active) return next(new Error('Invalid token'));
                socket.handshake.auth.username = response.username;
                socket.handshake.auth.user_id = response.sub;
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
