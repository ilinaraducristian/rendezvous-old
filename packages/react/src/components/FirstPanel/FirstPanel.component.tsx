import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import Overlays from "../../Overlays";
import RootState from "../../state/root-state";
import serversState from "../../state/servers-state";
import "./FirstPanel.component.css";
import ServersComponent from "./Servers.component";

type ComponentProps = { rootState: RootState };

const FirstPanelComponent = observer(({ rootState }: ComponentProps) => {
  const addServer = useCallback(() => {
    rootState.overlay = [Overlays.addServer];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectFriendships = useCallback(() => {
    rootState.selectedServer = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ol className="first-panel">
      <li>
        <button type="button" onClick={selectFriendships} className={rootState.selectedServer !== null ? "" : "selected"}>
          F
        </button>
      </li>
      <ServersComponent rootState={rootState} serversState={serversState} />
      <li>
        <button type="button" onClick={addServer}>
          +
        </button>
      </li>
    </ol>
  );
});

export default FirstPanelComponent;
