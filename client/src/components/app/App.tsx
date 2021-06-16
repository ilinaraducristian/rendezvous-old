import React, {useCallback, useEffect, useState} from "react";
import Server from "../server/Server";
import Group from "../group/Group";
import Channel from "../channel/Channel";
import Member from "../member/Member";
import Message from "../message/Message";
import {mockChannels, mockGroups, mockMembers, mockMessages, mockServers, mockUsers} from "../../mock-data";
import {Socket} from "socket.io-client";
import MessagesPanel from "../messages-panel/MessagesPanel";
import Overlay from "../overlay/Overlay";
import {useKeycloak} from "@react-keycloak/web";
import Backend from "../../Backend";
import SortedMap from "../../util/SortedMap";

let socket: Socket;
let staticData: any;

// dev only
staticData = {
  users: mockUsers,
  servers: mockServers,
  channels: mockChannels,
  groups: mockGroups,
  messages: mockMessages,
  members: mockMembers
};

function parseServersData(serversData: any) {
  staticData.users = new SortedMap(serversData.users.map((user: any) => [user.id, user]));
  staticData.servers = new SortedMap(serversData.servers.map((server: any) => [server.id, server]));
  staticData.channels = new SortedMap(serversData.channels.map((channel: any) => [channel.id, channel]));
  staticData.groups = new SortedMap(serversData.groups.map((group: any) => [group.id, group]));
  staticData.messages = new SortedMap(serversData.messages.map((message: any) => [message.id, message]));
  staticData.members = new SortedMap(serversData.members.map((member: any) => [member.id, member]));
  console.log(staticData);
}

// in ui dev assume keycloak user logged in
function App() {

  const {keycloak, initialized} = useKeycloak();

  const [servers, setServers] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  const [server, setServer] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);

  const [overlay, setOverlay] = useState<any>(null);

  const messageMapper = useCallback((message) => {
    return <Message
        key={`message_${message.id}`}
        username={staticData.users.get(message.user_id)?.username || ""}
        timestamp={message.timestamp}
        text={message.text}
    />;
  }, []);

  const selectChannel = useCallback((id: number, name: string) => {
    const channel = {id, name};
    setChannel(channel);
    setMessages(staticData.messages.toArray().filter((message: any) => message.channel_id === channel.id).map(messageMapper));
  }, [messageMapper]);

  const channelMapper = useCallback((channel) => {
    return <Channel key={`channel_${channel.id}`} id={channel.id} name={channel.name} onSelectChannel={selectChannel}/>;
  }, [selectChannel]);

  const channelSorter = useCallback((firstChannel: any, secondChannel: any) => {
    return firstChannel.order - secondChannel.order;
  }, []);

  const groupMapper = useCallback((group) => {
    return <Group key={`group_${group.id}`} name={group.name}>
      {
        staticData.channels.toArray().filter((channel: any) => channel.group_id === group.id).sort(channelSorter).map(channelMapper)
      }
    </Group>;
  }, [channelMapper, channelSorter]);

  const memberMapper = useCallback((member) => {
    return <Member
        key={`member_${member.id}`}
        name={staticData.users.get(member.user_id)?.username || ""}
    />;
  }, []);

  const selectServer = useCallback((id: number) => {
    setChannels(staticData.channels.toArray().filter((channel: any) => channel.group_id === null && channel.server_id === id).sort(channelSorter).map((a: any) => {
      console.log(a);
      return a;
    }).map(channelMapper));
    setGroups(staticData.groups.toArray().filter((group: any) => group.server_id === id).map(groupMapper));
    setMembers(staticData.members.toArray().filter((member: any) => member.server_id === id).map(memberMapper));
    setServer({id});
  }, [channelMapper, channelSorter, groupMapper, memberMapper]);

  const serverMapper = useCallback((server) => {
    return <Server key={`server_${server.id}`} id={server.id} name={server.name} onSelectServer={selectServer}/>;
  }, [selectServer]);

  // initialization
  useEffect(() => {
    if (!initialized) return;
    if (!keycloak.authenticated) {
      keycloak.login();
      return;
    }
    Backend.token = `Bearer ${keycloak.token}`;
    (async () => {

      // register socketio
      // socket = io(config.backend, {
      //   auth: {
      //     sub: keycloak.subject
      //   }
      // });
      // TODO update data from backend
      parseServersData(await Backend.getServers());

      setServers(
          staticData.servers.toArray()
              .sort((server1: any, server2: any) => server1.order - server2.order)
              .map(serverMapper)
      );

    })();

  }, [serverMapper, initialized, keycloak]);

  const sendMessage = useCallback((message: any) => {
    socket?.emit("send_message", {channel_id: channel.id, text: message.text});
  }, [channel]);

  useEffect(() => {

    socket?.on("message_received", message => {
      message.timestamp = new Date(message.timestamp);
      staticData.messages.set(message.id, message);
      if (channel !== null)
        setMessages(staticData.messages.toArray().filter((message: any) => message.channel_id === channel.id).map(messageMapper));
    });

  }, [channel, messageMapper]);

  useEffect(() => {

    socket?.on("channel_created", channel => {
      staticData.channels.set(channel.id, channel);
      if (server !== null)
        setChannels(staticData.channels.toArray().filter((channel: any) => channel.group_id === null).sort(channelSorter).map(channelMapper));
    });

    socket?.on("channel_removed", channel => {
      staticData.channels.delete(channel.id);
      setChannels(staticData.channels.toArray().filter((channel: any) => channel.group_id === null).sort(channelSorter).map(channelMapper));
    });

  }, [channelMapper, channelSorter, server]);

  useEffect(() => {

    socket?.on("member_entered", member => {
      staticData.members.set(member.id, member);
      setMembers(staticData.members.toArray(memberMapper));
    });

    socket?.on("member_left", member => {
      staticData.members.set(member.id, member);
      setMembers(staticData.members.toArray(memberMapper));
    });

  }, [memberMapper]);

  const joinServer = useCallback((invitation) => {

  }, []);

  const createServer = useCallback((serverName: string) => {
    const lastServer = staticData.servers.last();
    console.log('last server');
    console.log(lastServer);
    let order = 0;
    if(lastServer !== undefined) {
      order = lastServer.order+1;
    }
    Backend.createServer(serverName, order).then(serverData => {
      setMembers([]);
      setMessages([]);
      staticData.servers.set(serverData.id, {
        id: serverData.id,
        name: serverName,
        user_id: keycloak.subject,
        order
      });

      staticData.groups.set(serverData.group1_id, {
        id: serverData.group1_id,
        server_id: serverData.id,
        name: "Text channels",
        order: 0
      });

      staticData.groups.set(serverData.group2_id, {
        id: serverData.group2_id,
        server_id: serverData.id,
        name: "Voice channels",
        order: 0
      });

      staticData.channels.set(serverData.channel1_id, {
        id: serverData.channel1_id,
        server_id: serverData.id,
        group_id: serverData.group1_id,
        type: "text",
        name: "general",
        order: 0
      });

      staticData.channels.set(serverData.channel2_id, {
        id: serverData.channel2_id,
        server_id: serverData.id,
        group_id: serverData.group2_id,
        type: "voice",
        name: "General",
        order: 0
      });

      staticData.members.set(serverData.member_id, {
        id: serverData.member_id,
        server_id: serverData.id,
        user_id: keycloak.subject
      });

    });
  }, [keycloak]);

  const addServer = useCallback(() => {
    setOverlay(<Overlay onJoinServer={joinServer} onCreateServer={createServer} onClose={() => setOverlay(null)}/>);
  }, [createServer, joinServer]);

  if (!initialized) return null;
  if (!keycloak.authenticated) return null;

  return (
      <>
        <div className="app-container">
          <div id="servers-container">
            {servers}
            <button type="button" onClick={addServer}>Add server</button>
          </div>
          <div id="channels-container">
            {channels}
            {groups}
          </div>
          <MessagesPanel
              channel={channel}
              messages={messages}
              onSendMessage={sendMessage}
          />
          <div id="members-container">
            {members}
          </div>
        </div>
        {
          overlay ?? true
        }
      </>
  );

}

export default App;

