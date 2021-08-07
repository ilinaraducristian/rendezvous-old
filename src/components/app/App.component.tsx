import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../state-management/store";
import {selectAuthenticated} from "../../state-management/slices/keycloakSlice";
import keycloak from "../../keycloak";
import {selectConnected} from "../../state-management/slices/socketioSlice";
import config from "../../config";
import {mockServers, mockUsers} from "../../mock-data";
import {initializeBackend, selectInitialized, selectOverlay} from "../../state-management/slices/serversDataSlice";
import ServersPanelComponent from "../server/ServersPanel.component";
import {useLazyGetUserServersDataQuery} from "../../state-management/apis/socketio";
import ChannelsPanelComponent from "../channels/ChannelsPanel.component";
import ContentPanelComponent from "../content/ContentPanel.component";
import AddServerOverlayComponent from "../overlay/AddServerOverlay.component";
import CreateChannelOverlayComponent from "../overlay/CreateChannelOverlay.component";
import CreateGroupOverlayComponent from "../overlay/CreateGroupOverlay.component";
import CreateServerOverlayComponent from "../overlay/CreateServerOverlay.component";
import InvitationOverlayComponent from "../overlay/InvitationOverlay.component";
import JoinServerOverlayComponent from "../overlay/JoinServerOverlay.component";

function AppComponent() {

  const authenticated = useAppSelector(selectAuthenticated);
  const connected = useAppSelector(selectConnected);
  const initialized = useAppSelector(selectInitialized);
  const overlay = useAppSelector(selectOverlay);
  const [fetch, {data, isSuccess, status}] = useLazyGetUserServersDataQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (config.offline) return;
    if (authenticated) return;
    keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html"
    })
        .then((authenticated: boolean) => {
          if (!authenticated) {
            return keycloak.login();
          }
        }).catch(() => {
      alert("failed to initialize");
    });
  }, [authenticated]);

  useEffect(() => {
    if (config.offline) {
      const processedServerData = {
        servers: mockServers,
        users: mockUsers
      };
      dispatch(initializeBackend(processedServerData));
      return;
    }
    if (!connected) return;
    if (initialized) return;
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, connected]);

  useEffect(() => {
    if (!isSuccess) return;
    if (data === undefined) return;
    dispatch(initializeBackend(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
      <>
        {/*((!initialized || !keycloak.authenticated) && !config.offline) ||*/}
        {
          overlay === null ||
          overlayToComponent(overlay)
        }
        <ServersPanelComponent/>
        <ChannelsPanelComponent/>
        <ContentPanelComponent/>
      </>
  );

}

function overlayToComponent({type, payload}: { type: string, payload: any }) {
  switch (type) {
    case "AddServerOverlayComponent":
      return <AddServerOverlayComponent/>;
    case "CreateChannelOverlayComponent":
      return <CreateChannelOverlayComponent groupId={payload.groupId}/>;
    case "CreateGroupOverlayComponent":
      return <CreateGroupOverlayComponent/>;
    case "CreateServerOverlayComponent":
      return <CreateServerOverlayComponent/>;
    case "InvitationOverlayComponent":
      return <InvitationOverlayComponent invitation={payload.invitation}/>;
    case "JoinServerOverlayComponent":
      return <JoinServerOverlayComponent/>;
  }
}

export default AppComponent;

