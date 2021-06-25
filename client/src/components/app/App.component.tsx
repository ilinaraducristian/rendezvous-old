import {useKeycloak} from "@react-keycloak/web";
import {createContext, Dispatch, useEffect, useReducer} from "react";
import {Channel, Group, Member, Message, Server, User} from "../../types";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";
import ServersPanelComponent from "../server/ServersPanel.component";
import ChannelsPanelComponent from "../channel/ChannelsPanel.component";
import ContentPanelComponent from "../content/ContentPanel.component";
import {mockChannels, mockGroups, mockMembers, mockMessages, mockServers, mockUsers} from "../../mock-data";


// type GlobalContextType = {
//   [key: string]: [state: any, setState: (value: ((prevState: any) => any) | any) => void]
// }

type GlobalContextType = {
  state: GlobalStatesType, dispatch: Dispatch<Action>
}

type GlobalStatesType = {
  servers: SortedMap<Server>,
  channels: SortedMap<Channel>,
  groups: SortedMap<Group>,
  messages: SortedMap<Message>,
  members: SortedMap<Member>,
  users: Map<string, User>,
  selectedServer: Server | null,
  selectedChannel: Channel | null,
  overlay: any
}

const initialState = {
  servers: new SortedMap<Server>(),
  channels: new SortedMap<Channel>(),
  groups: new SortedMap<Group>(),
  messages: new SortedMap<Message>(),
  members: new SortedMap<Member>(),
  users: new Map<string, User>(),
  selectedServer: null,
  selectedChannel: null,
  overlay: null,
};

const GlobalStates = createContext<GlobalContextType>({
  state: initialState, dispatch: () => {
  }
});

type Action = {
  type: string,
  payload?: any | ((oldState: any) => any)
}

export {GlobalStates};

function updateState(state: any, obj: string, payload: any | Function) {
  if (typeof payload === "function") {
    state[obj] = payload(state[obj]);
  } else {
    state[obj] = payload;
  }
}

function AppComponent() {

  const {keycloak} = useKeycloak();
  const Backend = useBackend();

  // if (!keycloak.authenticated)
  //   keycloak.login();

  // const [servers, _setServers] =                useState<SortedMap<Server>>(new SortedMap<Server>());
  // const [channels, _setChannels] =              useState<SortedMap<Channel>>(new SortedMap<Channel>());
  // const [groups, setGroups] =                   useState<SortedMap<Group>>(new SortedMap<Group>());
  // const [messages, setMessages] =               useState<SortedMap<Message>>(new SortedMap<Message>());
  // const [members, setMembers] =                 useState<SortedMap<Member>>(new SortedMap<Member>());
  // const [users, setUsers] =                     useState<Map<string, User>>(new Map<string, User>());
  // const [selectedServer, setSelectedServer] =   useState<Server | null>(null);
  // const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // const [overlay, setOverlay] = useState<any>(null);

  // const io = useSocketIo();
  // const messageReceivedEvent = useSocketEvent<Message>(io.socket, "message_received");
  // const newMemberEvent = useSocketEvent<Member>(io.socket, "new_member");
  // const userInfoUpdateEvent = useSocketEvent<User>(io.socket, "user_info_update");

  // useEffect(() => {
  //   setMessages((messages: SortedMap<Message>) => {
  //     messages.set(messageReceivedEvent.lastMessage.id, messageReceivedEvent.lastMessage);
  //     return messages;
  //   });
  // }, [messageReceivedEvent]);
  //
  // useEffect(() => {
  //   setMembers(members => {
  //     members.set(newMemberEvent.lastMessage.id, newMemberEvent.lastMessage);
  //     return members;
  //   });
  // }, [newMemberEvent]);
  //
  // useEffect(() => {
  //   setUsers(users => {
  //     users.set(userInfoUpdateEvent.lastMessage.id, userInfoUpdateEvent.lastMessage);
  //     return users;
  //   });
  // }, [userInfoUpdateEvent]);

  // const setServers = useCallback((value: ((prevState: SortedMap<Server>) => SortedMap<Server>) | SortedMap<Server>) => {
  //   if (selectedServer === null)
  //     return _setServers(value);
  //   let state = value;
  //   if (typeof value === "function")
  //     state = value(servers);
  //   const found = (state as SortedMap<Server>).get(selectedServer.id);
  //   if (found === undefined) {
  //     /*
  //      * if server was deleted from the state
  //      * remove it from selected server and remove the channel
  //      */
  //     setSelectedChannel(null);
  //     setSelectedServer(null);
  //     return _setServers(value);
  //   }
  //   setSelectedServer(found);
  //   return _setServers(value);
  //
  // }, [servers, selectedServer]);
  //
  // const setChannels = useCallback((value: ((prevState: SortedMap<Channel>) => SortedMap<Channel>) | SortedMap<Channel>) => {
  //   if (selectedChannel === null)
  //     return _setChannels(value);
  //   let state = value;
  //   if (typeof value === "function")
  //     state = value(channels);
  //   const found = (state as SortedMap<Channel>).get(selectedChannel.id);
  //   if (found === undefined) {
  //     /*
  //      * if Channel was deleted from the state
  //      * remove it from selected Channel and remove the channel
  //      */
  //     setSelectedChannel(null);
  //     return _setChannels(value);
  //   }
  //   setSelectedChannel(found);
  //   return _setChannels(value);
  //
  // }, [channels, selectedChannel]);

  const [state, dispatch] = useReducer((state: GlobalStatesType, action: Action) => {
    switch (action.type) {
      case "SERVERS_SET":
        updateState(state, "servers", action.payload);
        break;
      case "CHANNELS_SET":
        updateState(state, "channels", action.payload);
        break;
      case "GROUPS_SET":
        updateState(state, "groups", action.payload);
        break;
      case "MESSAGES_SET":
        updateState(state, "messages", action.payload);
        break;
      case "MEMBERS_SET":
        updateState(state, "members", action.payload);
        break;
      case "USERS_SET":
        updateState(state, "users", action.payload);
        break;
      case "SERVER_SELECTED":
        updateState(state, "selectedServer", action.payload);
        break;
      case "CHANNEL_SELECTED":
        updateState(state, "selectedChannel", action.payload);
        break;
      case "OVERLAY_SET":
        updateState(state, "overlay", action.payload);
        break;
      default:
        throw new Error(`${action.type} action not defined`);
    }
    return state;
  }, initialState);

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
      dispatch({type: "SERVERS_SET", payload: apiServers.servers});
      dispatch({type: "CHANNELS_SET", payload: apiServers.channels});
      dispatch({type: "GROUPS_SET", payload: apiServers.groups});
      dispatch({type: "MEMBERS_SET", payload: apiServers.members});
      dispatch({type: "MESSAGE_SET", payload: mockMessages});
      dispatch({type: "USERS_SET", payload: apiUsers});
    })();

  }, [Backend.getUserServersData, keycloak]);

  // if (!initialized || !keycloak.authenticated) return null;

  return (
      <GlobalStates.Provider value={{state, dispatch}}>
        <ServersPanelComponent/>
        <ChannelsPanelComponent/>
        {/*<MessagesPanelComponent/>*/}
        <ContentPanelComponent/>
      </GlobalStates.Provider>
  );

}

export default AppComponent;