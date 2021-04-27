import fetch from 'node-fetch';

function fastifyKeycloakAuth(fastify, options, done) {

    const authEndpoints = options.authEndpoints;
    const tokenIntrospectionEndpoint = options.tokenIntrospectionEndpoint;
    const client_id = options.client_id;
    const client_secret = options.client_secret;

    options.fastify.addHook('onRequest', async (req) => {
        let found = false;
        for (const endpoint of authEndpoints) {
            if (req.url.match(endpoint)) {
                found = true;
                break;
            }
        }
        if (!found) return;
        if (req.headers.authorization === null || req.headers.authorization === undefined) throw new Error('Authorization header is missing');
        req.auth = await verifyToken(req.headers.authorization);
    });

    function verifyToken(token) {
        return fetch(tokenIntrospectionEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `token=${token.replace('Bearer ', '')}&client_id=${client_id}&client_secret=${client_secret}`
        })
            .then(response => response.json())
            .then(response => {
                if (response.active !== true) throw new Error('Invalid token');
                return response;
            });
    }

    done();

}

export default fastifyKeycloakAuth;
