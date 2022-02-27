import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import keycloak from "../../keycloak";
import Overlays from "../../Overlays";
import friendshipsState from "../../state/friendships-state";
import RootState from "../../state/root-state";
import { ServersState } from "../../state/servers-state";
import FriendshipsComponent from "./Friendships.component";
import GroupsComponent from "./Groups.component";
import "./SecondPanel.component.css";

type ComponentProps = { rootState: RootState; serversState: ServersState };

const SecondPanelComponent = observer(({ rootState, serversState }: ComponentProps) => {
  const showNewGroupOverlay = useCallback(() => {
    if (rootState.selectedServer === null) return;
    rootState.overlay = [Overlays.addGroup, rootState.selectedServer.id];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootState.selectedServer]);

  const showFriendshipInvitationOverlay = useCallback(() => {
    rootState.overlay = [Overlays.addFriendship];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createInvitation = useCallback(async () => {
    if (rootState.selectedServer === null) return;
    navigator.clipboard.writeText(await rootState.selectedServer.apiNewInvitation());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootState.selectedServer]);

  const showNewChannelOverlay = useCallback(() => {
    if (rootState.selectedServer === null) return;
    const group = rootState.selectedServer.groups.array.find((group) => group.order === 0);
    if (group === undefined) return;
    rootState.overlay = [Overlays.addChannel, { serverId: rootState.selectedServer.id, groupId: group.id }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootState.selectedServer]);

  const deleteServer = useCallback(async () => {
    if (rootState.selectedServer === null) return;
    rootState.selectedServer.apiDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leaveServer = useCallback(async () => {
    if (rootState.selectedServer === null) return;
    await rootState.selectedServer.apiLeave();
    serversState.servers.delete(rootState.selectedServer.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootState.selectedServer]);

  const copyUserId = useCallback(() => {
    navigator.clipboard.writeText(keycloak.subject ?? "");
  }, []);

  return (
    <div className="second-panel">
      <header>
        {rootState.selectedServer === null ? (
          <>
            <span>Friends</span>
            <button type="button" onClick={showFriendshipInvitationOverlay}>
              +
            </button>
          </>
        ) : (
          <>
            <div>
              <button type="button" onClick={createInvitation}>
                {rootState.selectedServer.name}
              </button>
            </div>
            <div>
              <button type="button" onClick={showNewGroupOverlay}>
                +G
              </button>
              <button type="button" onClick={showNewChannelOverlay}>
                +C
              </button>
              <button type="button" onClick={deleteServer}>
                -S
              </button>
              <button type="button" onClick={leaveServer}>
                +L
              </button>
            </div>
          </>
        )}
      </header>
      <ol>
        {rootState.selectedServer === null || <GroupsComponent server={rootState.selectedServer} />}
        {rootState.selectedServer !== null || <FriendshipsComponent rootState={rootState} friendshipsState={friendshipsState} />}
      </ol>
      <footer>
        {keycloak.userInfo === undefined || (
          <button type="button" onClick={copyUserId}>
            {keycloak.userInfo.preferred_username}
          </button>
        )}
      </footer>
    </div>
  );
});

export default SecondPanelComponent;
