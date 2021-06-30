import {Server} from "../../types";
import {useMemo} from "react";

type ComponentProps = {
  server: Server,
  onSelectServer: Function
}

function ServerComponent({server, onSelectServer: selectServer}: ComponentProps) {

  return useMemo(() =>
          <li className="li li__server">
            <button className="btn btn__server" type="button" onClick={() => selectServer(server)}>
              {server.name[0]}
            </button>
          </li>
      , [selectServer, server]);

}

export default ServerComponent;