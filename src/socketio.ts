import config from "./config";
import {io as socketio_io, Socket as socketio_Socket} from "socket.io-client";
import {DefaultEventsMap, EventNames, EventParams} from "socket.io-client/build/typed-events";
import mediasoup from "./mediasoup";
import {addChannel, addChannelUser, addGroup, addMember, addMessages} from "./state-management/slices/serversDataSlice";
import {store} from "./state-management/store";
import {connect} from "./state-management/slices/socketioSlice";

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

const socket: Socket = socketio_io(config.socketIoUrl, {autoConnect: false}) as Socket;

Object.assign(socket, {emitAck});

socket.auth = {};

socket.on("connect", async () => {
  if (mediasoup.loaded) return;
  const {routerRtpCapabilities} = await socket.emitAck(`get_router_capabilities`);
  await mediasoup.load({routerRtpCapabilities});
  store.dispatch(connect());
});

socket.on("disconnect", () => {
  window.location.reload();
});

socket.on("new_message", (payload) => {
  store.dispatch(addMessages([payload]));
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
  store.dispatch(addChannelUser({socketId: payload.socketId, userId: payload.userId}));
});

export default socket;