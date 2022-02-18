import { observer } from "mobx-react-lite";
import { useRef } from "react";
import Api from "../../api";
import RootState from "../../state/root-state";
import { ServersState } from "../../state/servers-state";

type ComponentProps = {
  rootState: RootState;
  serversState: ServersState;
};

const AddServerOverlayComponent = observer(({ rootState, serversState }: ComponentProps) => {
  const invitationRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  async function addServer(type: string) {
    if (type === "join") {
      if (invitationRef.current === null) return;
      const server = await Api.joinServer(invitationRef.current.value);
      serversState.servers.set(server.id, server);
    } else if (type === "new") {
      if (nameRef.current === null) return;
      const server = await Api.newServer(nameRef.current.value);
      serversState.servers.set(server.id, server);
    }
    rootState.overlay = null;
  }

  return (
    <div>
      <span>invitation</span>
      <input type="text" ref={invitationRef} />
      <span>name</span>
      <input type="text" ref={nameRef} />
      <button type="button" onClick={() => addServer("join")}>
        Join
      </button>
      <button type="button" onClick={() => addServer("new")}>
        New
      </button>
    </div>
  );
});

export default AddServerOverlayComponent;
