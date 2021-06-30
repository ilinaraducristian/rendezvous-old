import {useKeycloak} from "@react-keycloak/web";
import {useSocket} from "socket.io-react-hook";
import config from "../config";
import {useEffect} from "react";

function useSocketIo() {

  const {keycloak} = useKeycloak();

  const socket = useSocket(config.backend, {
    autoConnect: false
  });

  useEffect(() => {
    if (keycloak.token === undefined) {
      socket.socket.disconnect();
    } else {
      socket.socket.auth = {
        token: keycloak.token
      };
      if (!socket.connected)
        socket.socket.connect();
    }
  }, [keycloak.token, socket.connected, socket.socket]);

  return socket;

}

export default useSocketIo;