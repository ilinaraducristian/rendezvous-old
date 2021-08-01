import {useEffect} from "react";
import {useAppSelector} from "../../state-management/store";
import {selectAuthenticated} from "../../state-management/slices/keycloakSlice";
import keycloak from "../../keycloak";
import {selectConnected} from "../../state-management/slices/socketioSlice";
import config from "../../config";
import {mockChannels, mockGroups, mockMembers, mockServers, mockUsers} from "../../mock-data";
import {selectInitialized, selectOverlay, serversDataSlice} from "../../state-management/slices/serversDataSlice";
import ServersPanelComponent from "../server/ServersPanel.component";
import {useGetUserServersDataQuery} from "../../state-management/apis/socketio";
import ChannelsPanelComponent from "../channel/ChannelsPanel.component";
import ContentPanelComponent from "../content/ContentPanel.component";

function AppComponent() {

  const authenticated = useAppSelector(selectAuthenticated);
  const connected = useAppSelector(selectConnected);
  const initialized = useAppSelector(selectInitialized);
  const overlay = useAppSelector(selectOverlay);

  useEffect(() => {
    if (config.offline) return;
    if (authenticated) return;
    keycloak.init({})
        .then((authenticated: boolean) => {
          if (!authenticated) {
            return keycloak.login();
          }
          // keycloakSlice.actions.authenticate();
        }).catch(() => {
      alert("failed to initialize");
    });
  }, [authenticated]);

  useEffect(() => {
    if (config.offline) {
      const processedServerData = {
        servers: mockServers,
        channels: mockChannels,
        groups: mockGroups,
        members: mockMembers,
        users: mockUsers
      };
      serversDataSlice.actions.setState(processedServerData);
      return;
    }
    if (!connected) return;
    if (initialized) return;
    const {data} = useGetUserServersDataQuery();
    if (data === undefined) return;
    serversDataSlice.actions.initializeBackend(data);
  }, [initialized, connected]);
  //
  // return (
  //     <GlobalStates.Provider value={{state, dispatch}}>{
  //       ((!initialized || !keycloak.authenticated) && !config.offline) ||
  //       <>
  //
  //       <SocketIoListeners/>
  //           <ServersPanelComponent/>
  //           <ChannelsPanelComponent/>
  //           <ContentPanelComponent/>
  //         {state.overlay}
  //       </>
  //     }
  //     </GlobalStates.Provider>
  // );

  return (
      <>
        {overlay}
        <ServersPanelComponent/>
        <ChannelsPanelComponent/>
        <ContentPanelComponent/>
      </>
  );

}

export default AppComponent;

