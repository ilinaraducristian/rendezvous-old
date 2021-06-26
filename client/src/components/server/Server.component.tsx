import {Server} from "../../types";

type ComponentProps = {
  server: Server,
  onSelectServer: Function
}

function ServerComponent({server, onSelectServer: selectServer}: ComponentProps) {

  return (
      <li className="li li__server">
        <button className="btn btn__server" type="button" onClick={() => selectServer(server)}>
          {server.name[0]}
        </button>
      </li>
  );

}

export default ServerComponent;