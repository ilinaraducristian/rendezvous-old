import MemberModel from "./models/MemberModel.js";

function socketioRoutes(fastify, io) {
    io.on('connection', socket => {

        socket.on('join_server', payload => onJoinServer(socket, payload));

        // text channel
        socket.on('send_message', payload => onSendMessage(socket, payload));

        // voice channel
        socket.on('call_me', () => onCallMe(socket));
        socket.on('offer_created', payload => onOfferCreated(socket, payload));
        socket.on('answer_created', payload => onAnswerCreated(socket, payload));

    });

    async function onJoinServer(socket, payload) {
        const [[member]] = await MemberModel.findByUserIdAndServerId();
        if (member === undefined) {
            return payload.cb({error: 'You are not a member of this server'});
        }
        socket.join(member['server_id']);
        payload.cb();
    }

    function onSendMessage(socket, payload) {
        const serverId = socket.rooms.get(payload['server_id']);
        if (serverId === undefined) return payload.cb({error: 'You are not a member of this server'});
        payload.username = socket.handshake.auth.username;
        io.to(serverId).emit('message_received', payload);
        payload.cb();
    }

    function onCallMe(socket) {
        socket.broadcast.emit('create_offering', {initiator: socket.id});
    }

    function onOfferCreated(socket, payload) {
        payload.caller = socket.id;
        socket.broadcast.emit('offer_created', payload);
    }

    function onAnswerCreated(socket, payload) {
        socket.broadcast.emit('answer_created', payload);
    }

}

export default socketioRoutes;
