import {fastify as fastify_init} from 'fastify';
import {Server} from 'socket.io';
import {promises as fs} from 'fs';
import * as cors from 'fastify-cors';

(async () => {
    await main();
})();

async function main() {

    const fastify = fastify_init({
        logger: true,
        https: {
            key: await fs.readFile('key.pem'),
            cert: await fs.readFile('cert.pem')
        }
    });

    fastify.register(cors, {
        origin: '*'
    });

    const io = new Server(fastify.server, {
        cors: {
            origin: "*"
        }
    });

    fastify.listen(3000, '0.0.0.0', (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }

    });

    io.on('connection', socket => {

        socket.on('call_me', () => {
            socket.broadcast.emit('create_offering', {initiator: socket.id});
        });

        socket.on('offer_created', payload => {
            payload.caller_id = socket.id;
            socket.broadcast.emit('offer_created', payload);
        });

        socket.on('answer_created', payload => {
            socket.broadcast.emit('answer_created', payload);
        });

    });
}

