import {createSlice} from "@reduxjs/toolkit";
import {SliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";
import Server from "types/Server";
import User from "types/User";
import channelReducers from "state-management/slices/data/channel.reducers";
import serverReducers from "state-management/slices/data/server.reducers";
import FreindRequest from "../../../types/FreindRequest";

export type DataSliceState = {
    isBackendInitialized: boolean,
    servers: Server[],
    friends: any[],
    friendRequests: FreindRequest[],
    users: User[],
    selectedServer: number | null,
    selectedChannel: number | null,
    secondPanelHeader: number,
    secondPanelBody: number,
    secondPanelFooter: number,
    header: number,
    thirdPanel: number,
    joinedVoiceChannel: { serverId: number, groupId: number | null, channelId: number } | null,
    overlay: { type: number, payload: any } | null,
}

const reducers = {
    initializeBackend(state: DataSliceState, {
        payload: {
            servers,
            friends,
            friendRequests,
            users,
        }
    }: { payload: { servers: Server[], users: User[], friends: any[], friendRequests: FreindRequest[] } }) {
        state.servers = servers;
        state.friends = friends;
        state.friendRequests = friendRequests;
        state.users = users;
        state.isBackendInitialized = true;
    },
    setOverlay(state: DataSliceState, {payload: overlay}: { payload: { type: number, payload: any } }) {
        state.overlay = overlay;
    },
    selectServer(state: DataSliceState, {payload: serverId}: { payload: number }) {
        state.selectedChannel = null;
        state.selectedServer = serverId;
    },
    selectChannel(state: DataSliceState, {payload: channelId}: { payload: number }) {
        state.selectedChannel = channelId;
    },
    setSecondPanelHeader(state: DataSliceState, {payload}: { payload: number }) {
        state.secondPanelHeader = payload;
    },
    setSecondPanelBody(state: DataSliceState, {payload}: { payload: number }) {
        state.secondPanelBody = payload;
    },
    setSecondPanelFooter(state: DataSliceState, {payload}: { payload: number }) {
        state.secondPanelFooter = payload;
    },
    setHeader(state: DataSliceState, {payload}: { payload: number }) {
        state.header = payload;
    },
    setThirdPanel(state: DataSliceState, {payload}: { payload: number }) {
        state.thirdPanel = payload;
    },
    addFriendRequest(state: DataSliceState, {payload}: { payload: { id: number, userId: string, incoming: boolean } }) {
        state.friendRequests.push(payload);
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
        friendRequests: [],
        selectedServer: null,
        selectedChannel: null,
        secondPanelHeader: 0,
        secondPanelBody: 0,
        secondPanelFooter: 0,
        header: 0,
        thirdPanel: 0,
        joinedVoiceChannel: null,
        overlay: null,
    },
    reducers
});

export const {
    setChannelsOrder,
    initializeBackend,
    setInvitation,
    addChannelUsers,
    setJoinedVoiceChannel,
    joinVoiceChannel,
    leaveVoiceChannel,
    selectServer,
    selectChannel,
    setSecondPanelHeader,
    setSecondPanelBody,
    addFriendRequest,
    setHeader,
    setThirdPanel,
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