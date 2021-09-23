import config from "config";
import {io as socketio_io, Socket as socketio_Socket} from "socket.io-client";
import {DefaultEventsMap, EventNames, EventParams} from "socket.io-client/build/typed-events";
import mediasoup, {consumers, notificationSound} from "mediasoup";
import {
    addChannel,
    addChannelUsers,
    addFriendRequest,
    addGroup,
    addMember,
    addMessages,
    deleteMessage,
    deleteServer,
    editMessage
} from "state-management/slices/data/data.slice";
import {store} from "state-management/store";
import {connect} from "state-management/slices/socketio.slice";

function emitAck<Ev extends EventNames<DefaultEventsMap>>(ev: Ev, ...args: EventParams<DefaultEventsMap, Ev>): Promise<any> {
    return new Promise(resolve => {
        if (args.length === 0)
            return socket.emit(ev, 0, resolve);
        socket.emit(ev, ...args, resolve);
    });
}

class Socket extends socketio_Socket {

    auth: { [key: string]: any } = {};

    emitAck = emitAck;

}

const socket: Socket = socketio_io(config.socketIoUrl, {
    autoConnect: false,
    transports: ["websocket"],
    path: config.production ? '/api/socket.io' : undefined
}) as Socket;

Object.assign(socket, {emitAck});

socket.auth = {};

socket.on("connect", async () => {
    if (mediasoup.loaded) return;
    const {routerRtpCapabilities} = await socket.emitAck(`get_router_capabilities`);
    await mediasoup.load({routerRtpCapabilities});
    store.dispatch(connect());
});

socket.on("disconnect", () => {
    // window.location.reload();
});

socket.on("new_message", (payload) => {
    store.dispatch(addMessages([payload]));
    if (document.hidden) {
        notificationSound.currentTime = 0;
        notificationSound.play();
    }
});

socket.on("new_member", (payload) => {
    store.dispatch(addMember(payload));
});

socket.on("new_channel", (payload) => {
    store.dispatch(addChannel(payload));
});

socket.on("new_group", (payload) => {
    store.dispatch(addGroup(payload));
});

socket.on("user_joined_voice-channel", (payload) => {
    store.dispatch(addChannelUsers([payload]));
});

socket.on("message_edited", (payload) => {
    store.dispatch(editMessage(payload));
});

socket.on("message_deleted", (payload) => {
    store.dispatch(deleteMessage(payload));
});

socket.on('new_friend_request', (payload) => {
    store.dispatch(addFriendRequest(payload));
})

socket.on('friend_request_accepted', () => {
    // store.dispatch(add)
})

socket.on('server_deleted', (payload) => {
    store.dispatch(deleteServer(payload))
})

socket.on('consumer_pause', (payload) => {
    const found = consumers.find(({consumer}) => consumer.id === payload.consumerId);
    if (found === undefined) return;
    found.consumer.pause();
})

socket.on('consumer_resume', (payload) => {
    const found = consumers.find(({consumer}) => consumer.id === payload.consumerId);
    if (found === undefined) return;
    found.consumer.resume();
})

export default socket;