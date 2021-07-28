import {useKeycloak} from "@react-keycloak/web";
import {useEffect, useReducer} from "react";
import useBackend from "../../hooks/backend.hook";
import {GlobalStates, initialState} from "../../state-management/global-state";
import ServersPanelComponent from "../server/ServersPanel.component";
import ChannelsPanelComponent from "../channel/ChannelsPanel.component";
import ContentPanelComponent from "../content/ContentPanel.component";
import SocketIoListeners from "../SocketIoListeners";
import Fuse from "../../util/fuse";
import {mockChannels, mockGroups, mockMembers, mockMessages, mockServers, mockUsers} from "../../mock-data";
import config from "../../config";
import useSocketIo from "../../hooks/socketio.hook";
import Actions from "../../state-management/actions";
import reducer from "../../state-management/reducer";

const backendInitialized: Fuse = new Fuse();

function AppComponent() {

  const {keycloak, initialized} = useKeycloak();
  const Backend = useBackend();
  const {socket} = useSocketIo();

  const [state, dispatch] = useReducer(reducer, initialState);


  useEffect(() => {
    if (state.device.loaded) return;
    if (!socket.connected) return;
    socket.emitAck(`get_router_capabilities`)
        .then(({routerRtpCapabilities}) => state.device.load({routerRtpCapabilities}))
        .then(() => dispatch({type: Actions.DEVICE_LOADED}));
  }, [state.device.loaded, socket.connected]);

  useEffect(() => {
    keycloak.onAuthSuccess = () => {
      if (socket.connected) return;
      socket.auth = {
        token: keycloak.token
      };
      socket.connect();
    };

    keycloak.onAuthRefreshSuccess = () => {
      socket.auth = {
        token: keycloak.token
      };
    };
  }, [keycloak, socket]);

  useEffect(() => {
    if (!config.offline) {
      if (!initialized)
        return;
      if (!keycloak.authenticated) {
        keycloak.login();
        return;
      }
      if (keycloak.token === undefined) return;
    }

    if (backendInitialized.state) return;
    backendInitialized.blow();

    if (config.offline) {
      // dev only
      const processedServerData = {
        servers: mockServers,
        channels: mockChannels,
        groups: mockGroups,
        members: mockMembers,
        users: mockUsers
      };
      dispatch({type: Actions.INITIAL_DATA_GATHERED, payload: processedServerData});
      dispatch({type: Actions.MESSAGES_ADDED, payload: mockMessages});
    } else {
      // PROD
      Backend.getUserServersData()
          .then(serversData => {
            dispatch({
              type: Actions.INITIAL_DATA_GATHERED,
              payload: serversData
            });
          });
    }

  }, [Backend, initialized, keycloak]);

  return (
      <GlobalStates.Provider value={{state, dispatch}}>{
        ((!initialized || !keycloak.authenticated) && !config.offline) ||
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

