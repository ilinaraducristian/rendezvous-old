import {createSlice} from "@reduxjs/toolkit";
import {SliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";
import Server from "../../types/Server";
import User from "../../types/User";
import Channel, {ChannelType, TextChannel, VoiceChannel} from "../../types/Channel";
import Message from "../../types/Message";
import Member from "../../types/Member";
import Group from "../../types/Group";

type State = {
  backendInitialized: boolean,
  servers: Server[],
  users: User[],
  selectedServer: number | null,
  selectedChannel: number | null,
  overlay: { type: string, payload: any } | null,
}

export const serversSlice = createSlice<State, SliceCaseReducers<State>, string>({
  name: "servers",
  initialState: {
    backendInitialized: false,
    servers: [],
    users: [],
    selectedServer: null,
    selectedChannel: null,
    overlay: null,
  },
  reducers: {
    initializeBackend(state, {payload: {servers, users}}: { payload: { servers: Server[], users: User[] } }) {
      state.servers = servers;
      state.users = users;
      state.backendInitialized = true;
    },
    setInvitation(state, action) {
      const server = state.servers.find(server => server.id === state.selectedServer);
      if (server === undefined) return;
      server.invitation = action.payload;
    },
    closeOverlay(state) {
      state.overlay = null;
    },
    addChannelUsers(state, {payload}: { payload: { channelId: number, socketId: string, userId: string }[] }) {
      const channels = state.servers.map(server => server.channels.concat(server.groups.map(group => group.channels).flat()).filter(channel => channel.type === ChannelType.Voice)).flat();
      if (channels.length === 0) return;
      payload.forEach(u1 => {
        const channel = channels.find(channel => channel.id === u1.channelId) as VoiceChannel | undefined;
        if (channel === undefined) return;
        const existingUserIndex = channel.users.findIndex(user => user.userId === u1.userId);
        if (existingUserIndex === -1)
          channel.users.push(u1);
        else
          channel.users[existingUserIndex] = u1;
      });
    },
    selectServer(state, {payload: serverId}: { payload: number }) {
      state.selectedChannel = null;
      state.selectedServer = serverId;
    },
    selectChannel(state, {payload: channelId}: { payload: number }) {
      state.selectedChannel = channelId;
    },
    setOverlay(state, {payload: overlay}: { payload: any }) {
      state.overlay = overlay;
    },
    addServer(state, {payload: server}: { payload: Server }) {
      const s1Index = state.servers.findIndex(s1 => s1.id === server.id);
      if (s1Index === -1)
        state.servers.push(server);
      else
        state.servers[s1Index] = server;
    },
    addMessages(state, {payload: messages}: { payload: Message[] }) {
      const channels = state.servers.map(server => server.channels.concat(server.groups.map(group => group.channels).flat()).filter(channel => channel.type === ChannelType.Text)).flat();
      if (channels.length === 0) return;
      messages.forEach(message => {
        const channel = channels.find(channel => channel.id === message.channelId) as TextChannel | undefined;
        if (channel === undefined) return;
        const messageId = channel.messages.findIndex(m1 => m1.id === message.id);
        if (messageId === -1)
          channel.messages.push(message);
        else
          channel.messages[messageId] = message;
      });
    },
    addUser(state, {payload: user}: { payload: User }) {
      const existingUserIndex = state.users.findIndex(u1 => u1.id === user.id);
      if (existingUserIndex === -1)
        state.users.push(user);
      else
        state.users[existingUserIndex] = user;

    },
    addMember(state, {payload: member}: { payload: Member }) {
      const members = state.servers.find(server => server.id === member.serverId)?.members;
      if (members === undefined) return;
      const memberIndex = members.findIndex(m1 => m1.id === member.id);
      if (memberIndex === -1)
        members.push(member);
      else
        members[memberIndex] = member;
    },
    addChannel(state, {payload: channel}: { payload: Channel }) {
      const server = state.servers.find(server => server.id === channel.serverId);
      if (server === undefined) return;
      if (channel.groupId === null) {
        const channelIndex = server.channels.findIndex(c1 => c1.id === channel.id);
        if (channelIndex === -1)
          server.channels.push(channel);
        else
          server.channels[channelIndex] = channel;
      } else {
        const group = server.groups.find(group => group.id === channel.groupId);
        if (group === undefined) return;
        const channelIndex = group.channels.findIndex(c1 => c1.id === channel.id);
        if (channelIndex === -1)
          group.channels.push(channel);
        else
          group.channels[channelIndex] = channel;
      }
    },
    addGroup(state, {payload: group}: { payload: Group }) {
      const server = state.servers.find(server => server.id === group.serverId);
      if (server === undefined) return;
      const groupIndex = server.groups.findIndex(g1 => g1.id === group.id);
      if (groupIndex === -1)
        server.groups.push(group);
      else
        server.groups[groupIndex] = group;
    },
    changeMessage(state, {payload}: { payload: { serverId: number, channelId: number, messageId: number, text: string } }) {
      const server = state.servers.find(server => server.id === payload.serverId);
      if (server === undefined) return;
      const channels = server.channels.concat(server.groups.map(group => group.channels).flat()).filter(channel => channel.type === ChannelType.Text);
      const channel = channels.find(channel => channel.id === payload.channelId) as TextChannel | undefined;
      if (channel === undefined) return;
      const message = channel.messages.find(message => message.id === payload.messageId);
      if (message === undefined) return;
      message.text = payload.text;
    },
    editMessage(state, {payload}: { payload: { serverId: number, channelId: number, messageId: number, text: string } }) {
      const server = state.servers.find(server => server.id === payload.serverId);
      if (server === undefined) return;
      const channels = server.channels.concat(server.groups.map(group => group.channels).flat()).filter(channel => channel.type === ChannelType.Text);
      const channel = channels.find(channel => channel.id === payload.channelId) as TextChannel | undefined;
      if (channel === undefined) return;
      const message = channel.messages.find(message => message.id === payload.messageId);
      if (message === undefined) return;
      message.text = payload.text;
    },
    deleteMessage(state, {payload}: { payload: { serverId: number, channelId: number, messageId: number } }) {
      const server = state.servers.find(server => server.id === payload.serverId);
      if (server === undefined) return;
      const channels = server.channels.concat(server.groups.map(group => group.channels).flat()).filter(channel => channel.type === ChannelType.Text);
      const channel = channels.find(channel => channel.id === payload.channelId) as TextChannel | undefined;
      if (channel === undefined) return;
      const messageIndex = channel.messages.findIndex(message => message.id === payload.messageId);
      if (messageIndex === -1) return;
      channel.messages
          .filter(message => message.replyId === payload.messageId)
          .forEach(message =>
              (message.replyId = null)
          );
      channel.messages.splice(messageIndex, 1);
    },
    setChannelsOrder(state, {payload}: { payload: { id: number, order: number, groupId: number | null }[] }) {
      const server = selectSelectedServer({servers: state});
      if (server === undefined) return;
      payload.forEach(newChannel => {
        if (newChannel.groupId === null) {
          const channel = server.channels.find(channel => channel.id === newChannel.id);
          if (channel === undefined) return;
          channel.order = newChannel.order;
        } else {
          const group = server.groups.find(group => group.id === newChannel.groupId);
          if (group === undefined) return;
          const channel = group.channels.find(channel => channel.id === newChannel.id);
          if (channel === undefined) return;
          channel.order = newChannel.order;
        }
      });
    }
  },
});

export const {
  setChannelsOrder,
  initializeBackend,
  setInvitation,
  closeOverlay,
  addChannelUsers,
  selectServer,
  selectChannel,
  setOverlay,
  addServer,
  addMessages,
  addMember,
  addChannel,
  changeMessage,
  deleteMessage,
  editMessage,
  addGroup,
  addUser
} = serversSlice.actions;

export const selectServers = ({servers}: { servers: State }): Server[] => servers.servers;
export const selectChannels = (groupId: number | null) => ({servers}: { servers: State }): Channel[] | undefined => {
  if (servers.selectedServer === undefined) return;
  const server = servers.servers.find(server => server.id === servers.selectedServer);
  if (groupId === null)
    return server?.channels;
  return server?.groups.find(group => group.id === groupId)?.channels;
};
export const selectGroups = ({servers}: { servers: State }): Group[] | undefined => {
  return servers.servers.find(server => server.id === servers.selectedServer)?.groups;
};
export const selectMembers = ({servers}: { servers: State }): Member[] | undefined => {
  return servers.servers.find(server => server.id === servers.selectedServer)?.members;
};
export const selectMessages = ({servers}: { servers: State }): Message[] | undefined => {
  const server = servers.servers.find(server => server.id === servers.selectedServer);
  const channel = server?.channels.concat(server?.groups.map(group => group.channels).flat())
      .find(channel => channel.id === servers.selectedChannel && channel.type === ChannelType.Text);
  return (channel as TextChannel | undefined)?.messages;
};
export const selectUsers = ({servers}: { servers: State }): User[] => servers.users;
export const selectSelectedServer = ({servers}: { servers: State }): Server | undefined => {
  return servers.selectedServer === null ? undefined : servers.servers.find(server => server.id === servers.selectedServer);
};
export const selectSelectedChannel = ({servers}: { servers: State }): Channel | undefined => {
  const server = servers.servers.find(server => server.id === servers.selectedServer);
  return server?.channels.concat(server?.groups.map(group => group.channels).flat())
      .find(channel => channel.id === servers.selectedChannel && channel.type === ChannelType.Text);
};
export const selectInitialized = ({servers}: { servers: State }): boolean => servers.backendInitialized;
export const selectOverlay = ({servers}: { servers: State }): { type: string, payload: any } | null => servers.overlay;

export default serversSlice.reducer;