import {createSlice} from "@reduxjs/toolkit";
import {SliceCaseReducers} from "@reduxjs/toolkit/src/createSlice";
import Server from "types/Server";
import User from "types/User";
import channelReducers from "state-management/slices/data/channel.reducers";
import serverReducers from "state-management/slices/data/server.reducers";
import FreindRequest from "../../../types/FreindRequest";
import Friendship from "../../../types/Friendship";
import Message from "../../../types/Message";
import {ChannelType, TextChannel} from "../../../types/Channel";

export type DataSliceState = {
    isBackendInitialized: boolean,
    servers: Server[],
    friendships: Friendship[],
    friendRequests: FreindRequest[],
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
}

const reducers = {
    initializeBackend(state: DataSliceState, {
        payload: {
            servers,
            friendships,
            friendRequests,
            users,
        }
    }: { payload: { servers: Server[], users: User[], friendships: Friendship[], friendRequests: FreindRequest[] } }) {
        state.servers = servers;
        state.friendships = friendships;
        console.log(state.friendships)
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
                // console.log(state.friendships)
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
    ...serverReducers,
    ...channelReducers
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
    selectFriendship,
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