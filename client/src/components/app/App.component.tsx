import {useKeycloak} from "@react-keycloak/web";
import {useEffect, useReducer} from "react";
import useBackend from "../../hooks/backend.hook";
import ServersPanelComponent from "../server/ServersPanel.component";
import ChannelsPanelComponent from "../channel/ChannelsPanel.component";
import ContentPanelComponent from "../content/ContentPanel.component";
import {mockChannels, mockGroups, mockMembers, mockMessages, mockServers, mockUsers} from "../../mock-data";
import SocketIOListeners from "../../SocketIOListeners";
import {Actions, GlobalStates, initialState, reducer} from "../../global-state";

function AppComponent() {

  const {keycloak} = useKeycloak();
  const Backend = useBackend();

  // if (!keycloak.authenticated)
  //   keycloak.login();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {

    // if (!keycloak.authenticated || keycloak.token === undefined) return;

    (async () => {
      // dev only
      const apiServers = {
        servers: mockServers,
        channels: mockChannels,
        groups: mockGroups,
        members: mockMembers,
      };
      const apiUsers = mockUsers;
      // const apiServers = await apiGetUserServersData();
      // const apiUsers = await apiGetUsersData(apiServers.members.map<string>(member => member.user_id).toArray() as string[])

      // setMessages(new SortedMap<Message>());
      dispatch({type: Actions.SERVERS_SET, payload: apiServers.servers});
      dispatch({type: Actions.CHANNELS_SET, payload: apiServers.channels});
      dispatch({type: Actions.GROUPS_SET, payload: apiServers.groups});
      dispatch({type: Actions.MEMBERS_SET, payload: apiServers.members});
      dispatch({type: Actions.MESSAGES_SET, payload: mockMessages});
      dispatch({type: Actions.USERS_SET, payload: apiUsers});
    })();

  }, [Backend.getUserServersData, keycloak]);

  // if (!initialized || !keycloak.authenticated) return null;

  return (
      <GlobalStates.Provider value={{state, dispatch}}>
        <SocketIOListeners/>
        <ServersPanelComponent/>
        <ChannelsPanelComponent/>
        <ContentPanelComponent/>
      </GlobalStates.Provider>
  );

}

export default AppComponent;