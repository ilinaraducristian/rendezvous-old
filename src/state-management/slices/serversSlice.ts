import {createSlice} from "@reduxjs/toolkit";
import {SliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";
import Server from "../../types/Server";
import User from "../../types/User";
import Channel, {ChannelType, TextChannel, VoiceChannel} from "../../types/Channel";
import Message from "../../types/Message";
import Member from "../../types/Member";
import Group from "../../types/Group";
import {selectSelectedServer} from "../selectors";

export type State = {
  backendInitialized: boolean,
  servers: Server[],
  users: User[],
  selectedServer: number | null,
  selectedChannel: number | null,
  joinedVoiceChannel: { serverId: number, groupId: number | null, channelId: number } | null,
  overlay: { type: string, payload: any } | null,
}

const reducers = {
  initializeBackend(state: State, {payload: {servers, users}}: { payload: { servers: Server[], users: User[] } }) {
    state.servers = servers;
    state.users = users;
    state.backendInitialized = true;
  },
  setInvitation(state: State, action: { payload: any, type: string }) {
    const server = state.servers.find(server => server.id === state.selectedServer);
    if (server === undefined) return;
    server.invitation = action.payload;
  },
  closeOverlay(state: State) {
    state.overlay = null;
  },
  addChannelUsers(state: State, {payload}: { payload: { channelId: number, socketId: string, userId: string }[] }) {
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
  selectServer(state: State, {payload: serverId}: { payload: number }) {
    state.selectedChannel = null;
    state.selectedServer = serverId;
  },
  selectChannel(state: State, {payload: channelId}: { payload: number }) {
    state.selectedChannel = channelId;
  },
  setOverlay(state: State, {payload: overlay}: { payload: any }) {
    state.overlay = overlay;
  },
  addServer(state: State, {payload: server}: { payload: Server }) {
    const s1Index = state.servers.findIndex(s1 => s1.id === server.id);
    if (s1Index === -1)
      state.servers.push(server);
    else
      state.servers[s1Index] = server;
  },
  addMessages(state: State, {payload: messages}: { payload: Message[] }) {
    const channels = state.servers
        .map(server => server.channels
            .concat(server.groups.map(group => group.channels).flat())
            .filter(channel => channel.type === ChannelType.Text))
        .flat();
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
  addUser(state: State, {payload: user}: { payload: User }) {
    const existingUserIndex = state.users.findIndex(u1 => u1.id === user.id);
    if (existingUserIndex === -1)
      state.users.push(user);
    else
      state.users[existingUserIndex] = user;

  },
  addMember(state: State, {payload: member}: { payload: Member }) {
    const members = state.servers.find(server => server.id === member.serverId)?.members;
    if (members === undefined) return;
    const memberIndex = members.findIndex(m1 => m1.id === member.id);
    if (memberIndex === -1)
      members.push(member);
    else
      members[memberIndex] = member;
  },
  addChannel(state: State, {payload: channel}: { payload: Channel }) {
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
  addGroup(state: State, {payload: group}: { payload: Group }) {
    const server = state.servers.find(server => server.id === group.serverId);
    if (server === undefined) return;
    const groupIndex = server.groups.findIndex(g1 => g1.id === group.id);
    if (groupIndex === -1)
      server.groups.push(group);
    else
      server.groups[groupIndex] = group;
  },
  editMessage(state: State, {payload}: { payload: { serverId: number, channelId: number, messageId: number, text: string } }) {
    const server = state.servers.find(server => server.id === payload.serverId);
    if (server === undefined) return;
    const message = (server.channels
        .concat(server.groups.map(group => group.channels).flat())
        .filter(channel => channel.type === ChannelType.Text)
        .find(channel => channel.id === payload.channelId) as TextChannel | undefined)?.messages
        .find(message => message.id === payload.messageId);
    if (message === undefined) return;
    message.text = payload.text;
  },
  deleteMessage(state: State, {payload}: { payload: { serverId: number, channelId: number, messageId: number } }) {
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
  setChannelsOrder(state: State, {payload}: { payload: { id: number, order: number, groupId: number | null }[] }) {
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
  },
  joinVoiceChannel(state: State, {payload}: { payload: { serverId: number, groupId: number | null, channelId: number } }) {
    state.joinedVoiceChannel = payload;
  },
  leaveVoiceChannel(state: State) {
    state.joinedVoiceChannel = null;
  }
};

export const serversSlice = createSlice<State, SliceCaseReducers<State>, string>({
  name: "servers",
  initialState: {
    backendInitialized: false,
    servers: [],
    users: [],
    selectedServer: null,
    selectedChannel: null,
    joinedVoiceChannel: null,
    overlay: null,
  },
  reducers
});

export const {
  setChannelsOrder,
  initializeBackend,
  setInvitation,
  closeOverlay,
  addChannelUsers,
  joinVoiceChannel,
  leaveVoiceChannel,
  selectServer,
  selectChannel,
  setOverlay,
  addServer,
  addMessages,
  addMember,
  addChannel,
  deleteMessage,
  editMessage,
  addGroup,
  addUser
} = serversSlice.actions;

export default serversSlice.reducer;