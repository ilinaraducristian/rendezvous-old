import {useSocket} from "socket.io-react-hook";
import config from "../config";
import {useCallback, useEffect} from "react";
import {DefaultEventsMap, EventNames, EventParams} from "socket.io-client/build/typed-events";

function useSocketIo() {

  const socket = useSocket(config.socketIoUrl, {
    autoConnect: false,
    transports: ["websocket"]
  });

  useEffect(() => {
    socket.socket.on("disconnect", () => {
      window.location.reload();
    });
  }, [socket.socket]);

  const emitAck = useCallback(<ReturnValue = any, Ev extends EventNames<DefaultEventsMap> = string>(ev: Ev, ...args: EventParams<DefaultEventsMap, Ev>) => {
    return new Promise<ReturnValue>(resolve => {
      if (args.length === 0)
        return socket.socket.emit(ev, 0, resolve);
      socket.socket.emit(ev, ...args, resolve);
    });
  }, [socket]);

  return {
    socket: Object.assign(socket.socket, {emitAck}),
    connected: socket.connected,
    error: socket.error
  };

}

export default useSocketIo;