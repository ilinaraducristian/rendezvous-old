import {useKeycloak} from "@react-keycloak/web";
import {useEffect, useReducer} from "react";
import useBackend from "../../hooks/backend.hook";
import {Actions, GlobalStates, initialState, reducer} from "../../global-state";
import ServersPanelComponent from "../server/ServersPanel.component";
import ChannelsPanelComponent from "../channel/ChannelsPanel.component";
import ContentPanelComponent from "../content/ContentPanel.component";

let oneTime = false;

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

    if (oneTime) return;
    oneTime = true;


    (async () => {
      // dev only
      // const apiServers = {
      //   servers: mockServers,
      //   channels: mockChannels,
      //   groups: mockGroups,
      //   members: mockMembers,
      // };
      // const apiUsers = mockUsers;

      // PROD
      const serversData = await Backend.getUserServersData();
      // setMessages(new SortedMap<Message>());
      dispatch({
        type: Actions.INITIAL_DATA_GATHERED,
        payload: serversData
      });

    })();

  }, [Backend, initialized, keycloak]);

  return (
      <GlobalStates.Provider value={{state, dispatch}}>{
        (!initialized || !keycloak.authenticated) ||
        <>
          {/*<SocketIOListeners/>*/}
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

