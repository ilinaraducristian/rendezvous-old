import config from "config";
import {io as socketio_io, Socket as socketio_Socket} from "socket.io-client";
import {DefaultEventsMap, EventNames, EventParams} from "socket.io-client/build/typed-events";

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
import {notificationSound} from "./mediasoup/ReactMediasoupProvider";

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

export default socket;