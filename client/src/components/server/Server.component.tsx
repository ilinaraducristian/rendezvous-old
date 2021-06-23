import {Server} from "../../types";

function ServerComponent({server, onSelectServer: selectServer}: { server: Server, onSelectServer: Function }) {

  return (
      <li className="li li__server">
        <button className="btn btn__server" type="button" onClick={() => selectServer(server)}>
          {server.name[0]}
        </button>
      </li>
  );

}

export default ServerComponent;