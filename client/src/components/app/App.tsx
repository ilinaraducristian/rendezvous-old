import React, {useCallback, useEffect, useState} from "react";
import Server from "../server/Server";
import Group from "../group/Group";
import Channel from "../channel/Channel";
import Member from "../member/Member";
import Message from "../message/Message";
import {mockChannels, mockGroups, mockMembers, mockMessages, mockServers, mockUsers} from "../../mock-data";
import {io, Socket} from "socket.io-client";
import MessagesPanel from "../messages-panel/MessagesPanel";
import Overlay from "../overlay/Overlay";
import {useKeycloak} from "@react-keycloak/web";
import config from "../../config";
import Backend from "../../Backend";
import {log} from "util";

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

function parseServerData(server: any) {
  server.members.forEach((member: any) => staticData.members.set(member.id, member));
  server.messages.forEach((message: any) => staticData.messages.set(message.id, message));
  server.groups.forEach((group: any) => staticData.groups.set(group.id, group));
  server.channels.forEach((channel: any) => staticData.channels.set(channel.id, channel));
  staticData.servers.set(server.id, server);
}

// in dev assume keycloak user logged in
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
    setChannels(staticData.channels.toArray().filter((channel: any) => channel.group_id === null).sort(channelSorter).map(channelMapper));
    setGroups(staticData.groups.toArray(groupMapper));
    setMembers(staticData.members.toArray(memberMapper));
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
    console.log(keycloak.subject);
    // register socketio
    socket = io(config.backend, {
      auth: {
        sub: keycloak.subject
      }
    });
    // TODO update data from backend
    // staticData = Backend.getServers();
    //
    // setServers(staticData.servers.toArray(serverMapper));

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

  const createServer = useCallback((serverName) => {
    Backend.createServer(serverName).then(server => {
      setMembers([]);
      setMessages([]);
      parseServerData(server);
    });
  }, []);

  const addServer = useCallback(() => {
    setOverlay(<Overlay onJoinServer={joinServer} onCreateServer={createServer}/>);
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

