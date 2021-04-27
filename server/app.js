import {fastify as fastify_init} from 'fastify';
import {Server} from 'socket.io';
import * as cors from 'fastify-cors';
import config from './config.js';
import mysql from 'mysql2/promise';
import fastifyKeycloakAuth from './fastify_keycloak_auth.js';
import socketIOKeycloakAuth from './socketio_keycloak_auth.js';
import fastifyRoutes from "./fastify-routes.js";
import socketioRoutes from "./socketio-routes.js";

let fastify, io;

(async () => {
    // server initialization
    global.cappDB = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'capp'
    });

    fastify = fastify_init({
        logger: true,
        // https: {
        //     key: await fs.readFile('key.pem'),
        //     cert: await fs.readFile('cert.pem')
        // }
    });

    io = new Server(fastify.server, {
        cors: {
            origin: "*"
        }
    });

    io.use(socketIOKeycloakAuth({
        tokenIntrospectionEndpoint: config.keycloak.token_introspection_endpoint,
        client_id: config.keycloak.client_id,
        client_secret: config.keycloak.client_secret,
    }));

    fastify.register(cors, {
        origin: '*'
    });

    fastify.register(fastifyKeycloakAuth, {
        authEndpoints: ['.+'],
        tokenIntrospectionEndpoint: config.keycloak.token_introspection_endpoint,
        client_id: config.keycloak.client_id,
        client_secret: config.keycloak.client_secret,
        fastify
    });

    fastify.listen(3100, '0.0.0.0', (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });

    fastifyRoutes(fastify, io);
    socketioRoutes(fastify, io);

})();
