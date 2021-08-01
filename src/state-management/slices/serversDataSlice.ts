import {createSlice} from "@reduxjs/toolkit";
import SortedMap from "../../util/SortedMap";
import {Channel, Group, Member, Message, Server, UsersMap} from "../../types";

export const serversDataSlice = createSlice({
  name: "serversData",
  initialState: {
    backendInitialized: false,
    servers: new SortedMap<Server>(),
    channels: new SortedMap<Channel>(),
    groups: new SortedMap<Group>(),
    messages: new SortedMap<Message>(),
    members: new SortedMap<Member>(),
    users: new UsersMap(),
    selectedServer: {id: null},
    selectedChannel: {id: null},
    overlay: null,
  },
  reducers: {
    initializeBackend(state, action) {
      state.servers = action.payload.servers;
      state.channels = action.payload.channels;
      state.groups = action.payload.groups;
      state.members = action.payload.members;
      state.users = action.payload.users;
      state.backendInitialized = true;
    },
    setState(state, action) {
      state = action.payload.state;
    },
    setServer(state, action) {
      state.servers.set(action.payload.id, action.payload);
    },
    setChannel(state, action) {
      state.channels.set(action.payload.id, action.payload);
    },
    setGroup(state, action) {
      state.groups.set(action.payload.id, action.payload);
    },
    addChannelUser(state, {payload}) {
      (state.channels.get(payload.channelId) as Channel).users?.push({
        socketId: payload.socketId,
        userId: payload.userId
      });
      // TODO if not working, add the channel again to channels
    },
    setMessage(state, action) {
      state.messages.set(action.payload.id, action.payload);
    },
    setMember(state, action) {
      state.members.set(action.payload.member.id, action.payload.member);
      state.users.set(action.payload.user.id, action.payload.user);
    },
    selectServer(state, action) {
      state.selectedChannel = {id: null};
      state.selectedServer = {id: action.payload};
    },
    selectChannel(state, action) {
      state.selectedChannel = {id: action.payload};
      state.selectedServer = {id: action.payload};
    },
    setOverlay(state, action) {
      state.overlay = action.payload;
    },
    addServer(state, action) {
      state.servers.set(action.payload.id, action.payload);
      state.overlay = null;
    },
    addChannel(state, action) {
      state.channels.set(action.payload.id, action.payload);
      state.overlay = null;
    },
    addGroup(state, action) {
      state.groups.set(action.payload.id, action.payload);
      state.overlay = null;
    },
    setChannels(state, action) {
      state.channels = action.payload.channels;
    },
    addMessages(state, action) {
      (state.messages as SortedMap<Message>).concat(action.payload);
    },
    addChannels(state, action) {
      (state.channels as SortedMap<Channel>).concat(action.payload);
    },
  }
});

export const {setState, selectServer, setOverlay, addServer} = serversDataSlice.actions;
export const selectServers = (state: any): SortedMap<Server> => state.servers;
export const selectChannels = (state: any): SortedMap<Channel> => state.channels;
export const selectGroups = (state: any): SortedMap<Group> => state.groups;
export const selectMembers = (state: any): SortedMap<Member> => state.members;
export const selectMessages = (state: any): SortedMap<Message> => state.messages;
export const selectUsers = (state: any): UsersMap => state.users;
export const selectSelectedServer = (state: any): Server | null => state.selectedServer.id === null ? null : state.servers.get(state.selectedServer.id) as Server;
export const selectSelectedChannel = (state: any): Channel | null => state.selectedChannel.id === null ? null : state.channels.get(state.selectedChannel.id) as Channel;
export const selectInitialized = (state: any): boolean => state.backendInitialized;
export const selectOverlay = (state: any): any => state.overlay;

export default serversDataSlice.reducer;