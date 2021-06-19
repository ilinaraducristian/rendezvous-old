import {Server} from "../../types";

function ServerComponent({server, onSelectServer: selectServer}: { server: Server, onSelectServer: Function }) {

  return (
      <li>
        <button className="button" type="button" onClick={() => selectServer(server)}>{server.name}</button>
      </li>
  );

}

export default ServerComponent;