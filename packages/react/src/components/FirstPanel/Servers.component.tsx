import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import Server from "../../entities/server";
import RootState from "../../state/root-state";
import { ServersState } from "../../state/servers-state";

type ComponentProps = { rootState: RootState; serversState: ServersState };

const ServersComponent = observer(({ rootState, serversState }: ComponentProps) => {
  const selectServer = useCallback((server: Server) => {
    rootState.selectedServer = server;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {serversState.servers.map((server) => (
        <li key={server.id}>
          <button type="button" onClick={() => selectServer(server)} className={rootState.selectedServer?.id !== server.id ? '' : 'selected'}>
            {server.name[0]}
          </button>
        </li>
      ))}
    </>
  );
});

export default ServersComponent;
