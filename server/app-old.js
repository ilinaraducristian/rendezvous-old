import {fastify as fastify_init} from 'fastify';
import {Server} from 'socket.io';
import {v4 as uuid} from 'uuid';
import * as cors from 'fastify-cors';

const fastify = fastify_init({logger: true})

const io = new Server(fastify.server, {
    cors: {
        origin: "*",
        // methods: ["GET", "POST"]
    }
});

fastify.register(cors, {})

let call;
let offerCandidates = [];
let answerCandidates = [];

fastify.post('/call', (req, res) => {
    call = {offer: req.body};
    res.send();
})

fastify.get('/call', (req, res) => {
    res.send(call);
})

fastify.post('/answer', (req, res) => {
    call.answer = req.body;
    io.emit('answer', call);
    res.send();
})

fastify.post('/offerCandidates', (req, res) => {
    offerCandidates.push(req.body)
    io.emit('offerCandidate', req.body);
    res.send();
})

fastify.post('/answerCandidates', (req, res) => {
    answerCandidates.push(req.body)
    io.emit('answerCandidate', req.body);
    res.send();
})

// io.use(handleAuth)
// io.on('connection', handleConnections);
// io.on('connection', handleConnectionsTemp);

function handleConnectionsTemp(socket) {
    socket.on('call', req => {
        io.emit('calls', calls);
    });
    socket.on('modify_offerCandidates', req => {
        modif
    })
    socket.on('modify_answerCandidates', req => {
        offerCandidates
    })
}

function handleAuth(socket, next) {
    const token = socket.handshake.auth.token;
    // check keycloak token
    next();
}

function handleConnections(socket) {
    // join/leave text channel
    socket.on('join_tc', (request) => handleJoinTCRequest(socket, request));
    socket.on('leave_tc', (request) => handleLeaveTCRequest(socket, request));
    // join/leave voice channel
    socket.on('join_vc', (request) => handleJoinVCRequest(socket, request));
    socket.on('leave_vc', (request) => handleLeaveVCRequest(socket, request));

    socket.on('send_pm', (request) => handleSendPm(socket, request));
    socket.on('send_tc', (request) => handleSendTC(socket, request));
}

function handleJoinTCRequest(socket, request) {

}

function handleLeaveTCRequest(socket, request) {

}

function handleJoinVCRequest(socket, request) {

}

function handleLeaveVCRequest(socket, request) {

}

function handleSendPm(socket, request) {

}

function handleSendTC(socket, request) {

}


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
        fastify.log.error(err)
        process.exit(1)
    }
})

const room = new Map();

io.on('connection', socket => {

    socket.on('join_room', id => {

    });

    socket.on('join_room', (cb) => {
            const id = uuid();
        if (room.size === 0) {
            room.set(id, {socket});
            cb({action: 'nothing', id});
        } else {
            room.set(id, {socket});
            cb({action: 'create_offers', id, room: room.keys()});
        }
    });

    socket.on('offers_created', ({id, ices, offers}) => {
        const peer = room.get(id);
        peer.ices = ices;
        peer.ices = offers;
        offers.forEach(offer => {
            room.get(offer.id).socket.emit('create_answer', {caller: id, ices});
        })

    })

    socket.on('answer_created', ({ices, answer, caller}) => {
       room.get(caller).socket.emit({answer, ices});
    });

});
