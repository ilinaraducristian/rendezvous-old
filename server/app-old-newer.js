import {fastify as fastify_init} from 'fastify';
import {Server} from 'socket.io';
import {v4 as uuid} from 'uuid';
import * as cors from 'fastify-cors';

const fastify = fastify_init({logger: true});

const io = new Server(fastify.server, {
    cors: {
        origin: "*",
        // methods: ["GET", "POST"]
    }
});


// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('join', req => {
//         socket.join(req.channel);
//     });
//
//     socket.on('message', req => {
//         io.to(req.channel).emit('message', req.message);
//     });
//
//     socket.on('leave', req => {
//         socket.leave(req.channel)
//     });
// });

fastify.listen(3000, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});

let p1;
let p1_offer;
let p1_ices;

io.on('connection', socket => {

    socket.on('register', () => {
        p1 = socket;
    });

    socket.on('peer1_offer', ({ices, offer}) => {
        p1_ices = ices;
        p1_offer = offer;
    });

    socket.on('get_peer1_offer', cb => {
        cb({p1_ices, offer: p1_offer});
    });

    socket.on('answer', ({ices, answer}) => {
        p1.emit('answer', {ices, answer});
    });

});
