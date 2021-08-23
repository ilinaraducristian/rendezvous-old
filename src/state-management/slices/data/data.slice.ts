import {createSlice} from "@reduxjs/toolkit";
import {SliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";
import Server from "types/Server";
import User from "types/User";
import channelReducers from "state-management/slices/data/channel.reducers";
import serverReducers from "state-management/slices/data/server.reducers";

export type DataSliceState = {
  isBackendInitialized: boolean,
  servers: Server[],
  friends: string[],
  users: User[],
  selectedServer: number | null,
  selectedChannel: number | null,
  joinedVoiceChannel: { serverId: number, groupId: number | null, channelId: number } | null,
  overlay: { type: string, payload: any } | null,
}

const reducers = {
  initializeBackend(state: DataSliceState, {
    payload: {
      servers,
      friends,
      users,
    }
  }: { payload: { servers: Server[], users: User[], friends: string[] } }) {
    state.servers = servers;
    state.friends = friends;
    state.users = users;
    state.isBackendInitialized = true;
  },
  setOverlay(state: DataSliceState, {payload: overlay}: { payload: any }) {
    state.overlay = overlay;
  },
  closeOverlay(state: DataSliceState) {
    state.overlay = null;
  },
  selectServer(state: DataSliceState, {payload: serverId}: { payload: number }) {
    state.selectedChannel = null;
    state.selectedServer = serverId;
  },
  selectChannel(state: DataSliceState, {payload: channelId}: { payload: number }) {
    state.selectedChannel = channelId;
  },
  ...serverReducers,
  ...channelReducers
};

export const dataSlice = createSlice<DataSliceState, SliceCaseReducers<DataSliceState>, string>({
  name: "data",
  initialState: {
    isBackendInitialized: false,
    servers: [],
    friends: [],
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
} = dataSlice.actions;

export default dataSlice.reducer;