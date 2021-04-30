import MemberModel from "./models/MemberModel.js";
import ServerModel from "./models/ServerModel.js";
import MessageModel from "./models/MessageModel.js";

function socketioRoutes(fastify, io) {
    io.on('connection', socket => {

        socket.on('join_servers', (payload, cb) => onJoinServers(socket, payload, cb));
        socket.on('join_server', (payload, cb) => onJoinServer(socket, payload, cb));

        // text channel
        socket.on('send_message', (payload, cb) => onSendMessage(socket, payload, cb));

        // voice channel
        socket.on('call_me', () => onCallMe(socket));
        socket.on('offer_created', (payload, cb) => onOfferCreated(socket, payload, cb));
        socket.on('answer_created', (payload, cb) => onAnswerCreated(socket, payload, cb));

    });

    async function onJoinServers(socket, payload, cb) {
        const exists = await MemberModel.existsByUserIdAndServerIds(socket.handshake.auth.userId, payload.servers);
        if (!exists) {
            if (typeof cb === 'function')
                cb({error: new Error('You are not a member of all the specified servers, provide only the servers that you are a part of')});
            return;
        }
        payload.servers.forEach(server => socket.join(`server_${server}`));
        if (typeof cb === 'function')
            cb({status: 'ok'});
    }

    async function onJoinServer(socket, payload, cb) {
        const member = await MemberModel.findOneByUserIdAndServerId(payload.id);
        if (member === undefined) {
            if (typeof cb === 'function')
                cb({error: 'You are not a member of this server'});
            return;
        }
        socket.join(`server_${payload.id}`);
        if (typeof cb === 'function')
            cb({status: 'ok'});
    }

    async function onSendMessage(socket, payload, cb) {
        const isInRoom = socket.rooms.has(`server_${payload['server_id']}`);
        if (isInRoom === false) {
            if (typeof cb === 'function')
                cb({error: 'You are not a member of this server'});
            return;
        }
        const timestamp = new Date();
        const id = await MessageModel.save(socket.handshake.auth.userId, payload['channel_id'], timestamp, payload['text']);
        socket.to(`server_${payload['server_id']}`).emit('message_received', {
            server_id: payload['server_id'],
            channel_id: payload['channel_id'],
            message: {
                id,
                sender: socket.handshake.auth.username,
                timestamp,
                text: payload['text']
            }
        });
        if (typeof cb === 'function')
            cb({status: 'ok', timestamp});
    }

    function onCallMe(socket) {
        socket.broadcast.emit('create_offering', {initiator: socket.id});
    }

    function onOfferCreated(socket, payload, cb) {
        payload.caller = socket.id;
        socket.broadcast.emit('offer_created', payload);
    }

    function onAnswerCreated(socket, payload, cb) {
        socket.broadcast.emit('answer_created', payload);
    }

}

export default socketioRoutes;
