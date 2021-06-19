import {useKeycloak} from "@react-keycloak/web";
import {useSocket} from "socket.io-react-hook";
import config from "../config";

function useSocketIo() {
  const {keycloak} = useKeycloak();
  return useSocket(config.backend, {
    auth: {
      token: keycloak.token
    }
  });
}

export default useSocketIo;