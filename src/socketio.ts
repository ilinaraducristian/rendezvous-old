import config from "./config";
import {io as socketio_io, Socket as socketio_Socket} from "socket.io-client";
import {DefaultEventsMap, EventNames, EventParams} from "socket.io-client/build/typed-events";
import mediasoup from "./mediasoup";
import {serversDataSlice} from "./state-management/slices/serversDataSlice";

class Socket extends socketio_Socket {

  auth: { [key: string]: any } = {};

  async emitAck<Ev extends EventNames<DefaultEventsMap>>(ev: Ev, ...args: EventParams<DefaultEventsMap, Ev>): Promise<any> {
    return new Promise(resolve => {
      if (args.length === 0)
        return this.emit(ev, 0, resolve);
      this.emit(ev, ...args, resolve);
    });
  }

}

const socket: Socket = socketio_io(config.socketIoUrl, {autoConnect: false}) as Socket;

socket.on("connect", async () => {
  if (mediasoup.loaded) return;
  const {routerRtpCapabilities} = await socket.emitAck(`get_router_capabilities`);
  await mediasoup.load({routerRtpCapabilities});
});

socket.on("disconnect", () => {
  window.location.reload();
});

socket.on("new_message", (lastMessage) => {
  lastMessage.timestamp = new Date(lastMessage.timestamp);
  serversDataSlice.actions.setMessage(lastMessage);
});

socket.on("new_member", (lastMessage) => {
  serversDataSlice.actions.setMember(lastMessage);
});

socket.on("new_channel", (lastMessage) => {
  serversDataSlice.actions.setChannel(lastMessage);
});

socket.on("new_group", (lastMessage) => {
  serversDataSlice.actions.setGroup(lastMessage);
});

socket.on("user_joined_voice-channel", (lastMessage) => {
  serversDataSlice.actions.addChannelUser({socketId: lastMessage.socketId, userId: lastMessage.userId});
});

export default socket;