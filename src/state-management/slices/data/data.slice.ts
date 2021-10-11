import {createSlice} from "@reduxjs/toolkit";
import {SliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";
import channelReducers from "state-management/slices/data/channel.reducers";
import serverReducers from "state-management/slices/data/server.reducers";
import {User, UserData} from "dtos/user.dto";
import {Server} from "dtos/server.dto";
import {FriendRequest, Friendship} from "dtos/friend.dto";
import {Message} from "dtos/message.dto";
import {ChannelType, TextChannel} from "dtos/channel.dto";
import groupReducers from "state-management/slices/data/group.reducers";

export type DataSliceState = {
    isBackendInitialized: boolean,
    servers: Server[],
    friendships: Friendship[],
    friendRequests: FriendRequest[],
    users: User[],
    selectedFriendship: number | null,
    selectedServer: number | null,
    selectedChannel: number | null,
    secondPanelHeader: number,
    secondPanelBody: number,
    secondPanelFooter: number,
    header: number,
    thirdPanel: number,
    joinedVoiceChannel: { serverId: number, groupId: number | null, channelId: number } | null,
    overlay: { type: number, payload: any } | null,
    isSettingsShown: boolean
}

const reducers = {
    initializeBackend(state: DataSliceState, {payload}: { payload: UserData }) {
        state.servers = payload.servers;
        state.friendships = payload.friendships;
        state.friendRequests = payload.friendRequests;
        state.users = payload.users;
        state.isBackendInitialized = true;
    },
    setOverlay(state: DataSliceState, {payload: overlay}: { payload: { type: number, payload: any } }) {
        state.overlay = overlay;
    },
    selectServer(state: DataSliceState, {payload: serverId}: { payload: number }) {
        state.selectedChannel = null;
        state.selectedServer = serverId;
    },
    selectFriendship(state: DataSliceState, {payload: friendshipId}: { payload: number }) {
        state.selectedServer = null;
        state.selectedChannel = null;
        state.selectedFriendship = friendshipId;
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
    addMessages(state: DataSliceState, {payload: messages}: { payload: Message[] }) {
        const channels = state.servers
            .map(server => server.channels
                .concat(server.groups.map(group => group.channels).flat())
                .filter(channel => channel.type === ChannelType.Text))
            .flat();
        messages.forEach(message => {
            if (message.friendshipId !== null) {
                const friendship = state.friendships.find(friendship => friendship.id === message.friendshipId);
                if (friendship === undefined) return;
                const messageId = friendship.messages.findIndex(m1 => m1.id === message.id);
                if (messageId === -1)
                    friendship.messages.push(message);
                else
                    friendship.messages[messageId] = message;
                return;
            }
            if (channels.length === 0) return;
            const channel = channels.find(channel => channel.id === message.channelId) as TextChannel | undefined;
            if (channel === undefined) return;
            const messageId = channel.messages.findIndex(m1 => m1.id === message.id);
            if (messageId === -1)
                channel.messages.push(message);
            else
                channel.messages[messageId] = message;
        });
    },
    showSettings(state: DataSliceState) {
        state.isSettingsShown = true;
    },
    hideSettings(state: DataSliceState) {
        state.isSettingsShown = false;
    },
    ...serverReducers,
    ...channelReducers,
    ...groupReducers,
};

export const dataSlice = createSlice<DataSliceState, SliceCaseReducers<DataSliceState>, string>({
    name: "data",
    initialState: {
        isBackendInitialized: false,
        servers: [],
        friendships: [],
        users: [],
        friendRequests: [],
        selectedFriendship: null,
        selectedServer: null,
        selectedChannel: null,
        secondPanelHeader: 0,
        secondPanelBody: 0,
        secondPanelFooter: 0,
        header: 0,
        thirdPanel: 0,
        joinedVoiceChannel: null,
        overlay: null,
        isSettingsShown: false
    },
    reducers
});

export const {
    initializeBackend,
    setOverlay,
    selectServer,
    selectFriendship,
    selectChannel,
    setSecondPanelHeader,
    setSecondPanelBody,
    setSecondPanelFooter,
    setHeader,
    setThirdPanel,
    addFriendRequest,
    addMessages,
    showSettings,
    hideSettings,
} = dataSlice.actions;

// server reducers
export const {
    setInvitation,
    addServer,
    addUser,
    addMember,
    addChannel,
    addGroup,
    setChannelsOrder,
} = dataSlice.actions;

// channel reducers
export const {
    deleteServer,
    editMessage,
    moveChannels,
    deleteMessage,
    joinVoiceChannel,
    leaveVoiceChannel,
    addChannelUsers,
    removeChannelUsers,
    setUserIsTalking,
} = dataSlice.actions;

// group reducers
export const {
    moveGroups,
} = dataSlice.actions;

export default dataSlice.reducer;