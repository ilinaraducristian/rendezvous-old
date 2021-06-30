import {useKeycloak} from "@react-keycloak/web";
import {useEffect, useReducer} from "react";
import useBackend from "../../hooks/backend.hook";
import {Actions, GlobalStates, initialState, reducer} from "../../global-state";
import ServersPanelComponent from "../server/ServersPanel.component";
import ChannelsPanelComponent from "../channel/ChannelsPanel.component";
import ContentPanelComponent from "../content/ContentPanel.component";
import SocketIoListeners from "../../SocketIoListeners";
import Fuse from "../../util/fuse";

const backendInitialized: Fuse = new Fuse();

function AppComponent() {

  const {keycloak, initialized} = useKeycloak();
  const Backend = useBackend();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!initialized)
      return;
    if (!keycloak.authenticated) {
      keycloak.login();
      return;
    }
    if (keycloak.token === undefined) return;

    if (backendInitialized.state) return;
    backendInitialized.blow();

    // dev only
    // const apiServers = {
    //   servers: mockServers,
    //   channels: mockChannels,
    //   groups: mockGroups,
    //   members: mockMembers,
    // };
    // const apiUsers = mockUsers;

    // PROD
    Backend.getUserServersData()
        .then(serversData => {
          dispatch({
            type: Actions.INITIAL_DATA_GATHERED,
            payload: serversData
          });
        });

  }, [Backend, initialized, keycloak]);

  return (
      <GlobalStates.Provider value={{state, dispatch}}>{
        (!initialized || !keycloak.authenticated) ||
        <>
            <SocketIoListeners/>
            <ServersPanelComponent/>
            <ChannelsPanelComponent/>
            <ContentPanelComponent/>
          {state.overlay}
        </>
      }
      </GlobalStates.Provider>
  );

}

export default AppComponent;

