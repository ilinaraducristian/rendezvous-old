import {useKeycloak} from "@react-keycloak/web";
import {createContext, useCallback, useEffect, useState} from "react";
import {Channel, Group, Member, Message, Server, User} from "../../types";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";
import {mockChannels, mockGroups, mockMembers, mockMessages, mockServers, mockUsers} from "../../mock-data";
import ServersPanelComponent from "../server/ServersPanel.component";
import ChannelComponent from "../channel/Channel.component";
import GroupComponent from "../group/Group.component";


// type GlobalContextType = {
//   [key: string]: [state: any, setState: (value: ((prevState: any) => any) | any) => void]
// }

type GlobalContextType = {
  [key: string]: any
}

const GlobalContext = createContext<GlobalContextType>({});

export {GlobalContext};

function AppComponent() {

  const {keycloak, initialized} = useKeycloak();
  const {getUserServers: apiGetUserServers} = useBackend();

  // if (!keycloak.authenticated)
  //   keycloak.login();

  const [servers, _setServers] = useState<SortedMap<Server>>(new SortedMap<Server>());
  const [channels, _setChannels] = useState<SortedMap<Channel>>(new SortedMap<Channel>());
  const [groups, setGroups] = useState<SortedMap<Group>>(new SortedMap<Group>());
  const [messages, setMessages] = useState<SortedMap<Message>>(new SortedMap<Message>());
  const [members, setMembers] = useState<SortedMap<Member>>(new SortedMap<Member>());
  const [users, setUsers] = useState<Map<string, User>>(new Map<string, User>());
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const [overlay, setOverlay] = useState<any>(null);
  // const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  // const io = useSocketIo();
  // const messageReceivedEvent = useSocketEvent<any>(io.socket, "message_received");

  const setServers = useCallback((value: ((prevState: SortedMap<Server>) => SortedMap<Server>) | SortedMap<Server>) => {
    if (selectedServer === null)
      return _setServers(value);
    let state = value;
    if (typeof value === "function")
      state = value(servers);
    const found = (state as SortedMap<Server>).get(selectedServer.id);
    if (found === undefined) {
      /*
       * if server was deleted from the state
       * remove it from selected server and remove the channel
       */
      setSelectedChannel(null);
      setSelectedServer(null);
      return _setServers(value);
    }
    setSelectedServer(found);
    return _setServers(value);

  }, [servers, selectedServer]);

  const setChannels = useCallback((value: ((prevState: SortedMap<Channel>) => SortedMap<Channel>) | SortedMap<Channel>) => {
    if (selectedChannel === null)
      return _setChannels(value);
    let state = value;
    if (typeof value === "function")
      state = value(channels);
    const found = (state as SortedMap<Channel>).get(selectedChannel.id);
    if (found === undefined) {
      /*
       * if Channel was deleted from the state
       * remove it from selected Channel and remove the channel
       */
      setSelectedChannel(null);
      return _setChannels(value);
    }
    setSelectedChannel(found);
    return _setChannels(value);

  }, [channels, selectedChannel]);

  useEffect(() => {

    // if (!keycloak.authenticated || keycloak.token === undefined) return;

    // Backend.token = `Bearer ${keycloak.token}`;
    //
    // keycloak.onAuthRefreshSuccess = () => {
    //   Backend.token = `Bearer ${keycloak.token}`;
    // };

    (async () => {
      // dev only
      // const data1 = mockServers;
      // const data2 = mockUsers;
      // const data1 = await apiGetUserServers();
      // const data2 = await apiGetUsers();
      setServers(mockServers);
      setChannels(mockChannels);
      setGroups(mockGroups);
      setMessages(mockMessages);
      setMembers(mockMembers);
      setUsers(mockUsers);
    })();

  }, [apiGetUserServers, keycloak, setServers, setChannels]);

  // if (!initialized || !keycloak.authenticated) return null;

  return (
      <GlobalContext.Provider value={{
        servers: [servers, setServers],
        channels: [channels, setChannels],
        groups: [groups, setGroups],
        messages: [messages, setMessages],
        members: [members, setMembers],
        users: [users, setUsers],
        selectedServer: [selectedServer, setSelectedServer],
        selectedChannel: [selectedChannel, setSelectedChannel],
        overlay: [overlay, setOverlay]
      }}>
        <ServersPanelComponent/>
        {/*<ol className="servers">*/}
        {/*  {*/}
        {/*    servers.map(server =>*/}
        {/*        <li>*/}
        {/*          <button type="button" onClick={() => setSelectedServer(server)}>{server.name}</button>*/}
        {/*        </li>*/}
        {/*    )*/}
        {/*  }*/}
        {/*</ol>*/}
        <ol className="channels">
          {
            channels.filter(channel => channel.server_id === selectedServer?.id && channel.group_id === null)
                .map(channel =>
                    <ChannelComponent channel={channel}/>
                )
          }
          {
            groups.filter(group => group.server_id === selectedServer?.id)
                .map(group =>
                    <GroupComponent name={group.name}
                                    channels={channels.filter(channel => channel.group_id === group.id)}/>
                )
          }
        </ol>
        <ol className="messages">
          {
            messages.filter(message => message.channel_id === selectedChannel?.id)
                .map(message =>
                    <li>
                      {message.text}
                    </li>
                )
          }
        </ol>
      </GlobalContext.Provider>
  );

  // return (
  //     <GlobalContext.Provider value={{
  //       servers: [servers, setServers],
  //       channels: [channels, setChannels],
  //       groups: [groups, setGroups],
  //       messages: [messages, setMessages],
  //       members: [members, setMembers],
  //       overlay: [overlay, setOverlay],
  //       selectedServer: [selectedServer, setSelectedServer]
  //     }}>
  //       <div className="app-container">
  //         <ServersPanelComponent/>
  //         <ol className="list channels-container">
  //           {
  //             selectedServer === null ||
  //             <button className="button" type="button">{selectedServer.name}</button>
  //           }
  //           {
  //             channels.map(channel =>
  //                 <ChannelComponent key={`channel_${channel.id}`} channel={channel}/>
  //             )}
  //           {
  //             groups.map(group =>
  //                 <GroupComponent key={`group_${group.id}`} group={group}/>
  //             )}
  //         </ol>
  //         <div className="messages-container">
  //           <MessagesPanelComponent/>
  //         </div>
  //         <ol className="list members-container">
  //           {
  //             members.map(member =>
  //                 <li key={`member_${member.id}`}>
  //                   {`${member.firstName} ${member.lastName}`}
  //                 </li>
  //             )}
  //         </ol>
  //         {overlay}
  //       </div>
  //     </GlobalContext.Provider>
  // );

}

export default AppComponent;