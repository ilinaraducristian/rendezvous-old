import {useKeycloak} from "@react-keycloak/web";
import {createContext, useCallback, useEffect, useState} from "react";
import {Channel, Group, Member, Message, Server, User} from "../../types";
import useBackend from "../../hooks/backend.hook";
import SortedMap from "../../util/SortedMap";
import {mockChannels, mockGroups, mockMembers, mockMessages, mockServers, mockUsers} from "../../mock-data";
import ServersPanelComponent from "../server/ServersPanel.component";
import ChannelComponent from "../channel/Channel.component";
import GroupComponent from "../group/Group.component";
import MemberComponent from "../member/MemberComponent";
import MessagesPanelComponent from "../message/MessagesPanel.component";
import useSocketIo from "../../util/use-socket-io";
import {useSocketEvent} from "socket.io-react-hook";


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
  const {getUserServersData: apiGetUserServersData, getUsersData: apiGetUsersData} = useBackend();

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

  const io = useSocketIo();
  const messageReceivedEvent = useSocketEvent<Message>(io.socket, "message_received");

  useEffect(() => {
    setMessages((messages: SortedMap<Message>) => {
      messages.set(messageReceivedEvent.lastMessage.id, messageReceivedEvent.lastMessage);
      return messages;
    });
  }, [messageReceivedEvent]);

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

    if (!keycloak.authenticated || keycloak.token === undefined) return;

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

      setServers(apiServers.servers);
      setChannels(apiServers.channels);
      setGroups(apiServers.groups);
      setMembers(apiServers.members);
      // setMessages(new SortedMap<Message>());
      setMessages(mockMessages);
      setUsers(apiUsers);
    })();

  }, [apiGetUserServersData, keycloak, setChannels, setServers]);

  if (!initialized || !keycloak.authenticated) return null;

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
        <ol className="channels">
          {
            selectedServer === null ||
            <button className="button" type="button">{selectedServer.name}</button>
          }
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
        <MessagesPanelComponent/>
        <ol className="members">
          {
            members.filter((member: Member) => member.server_id === selectedServer?.id)
                .map((member: Member) => users.get(member.user_id) as User)
                .map((user: User) =>
                    <MemberComponent name={user.firstName}/>
                )
          }
        </ol>
      </GlobalContext.Provider>
  );

}

export default AppComponent;