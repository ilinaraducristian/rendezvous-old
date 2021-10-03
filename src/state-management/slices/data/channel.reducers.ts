import {DataSliceState} from "state-management/slices/data/data.slice";
import {ChannelType, TextChannel, VoiceChannel} from "../../../dtos/channel.dto";
import {selectSelectedServer} from "../../selectors/data.selector";
import {selectJoinedChannelUsers} from "../../selectors/channel.selector";

const channelReducers = {
    editMessage(state: DataSliceState, {payload}: { payload: { serverId: number, channelId: number, messageId: number, text: string } }) {
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
    deleteMessage(state: DataSliceState, {payload}: { payload: { serverId: number, channelId: number, messageId: number } }) {
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
                (message.replyId = null),
            );
        channel.messages.splice(messageIndex, 1);
    },
    joinVoiceChannel(state: DataSliceState, {payload}: { payload: { serverId: number, groupId: number | null, channelId: number } }) {
        state.joinedVoiceChannel = payload;
    },
    leaveVoiceChannel(state: DataSliceState) {
        state.joinedVoiceChannel = null;
    },
    moveChannels(state: DataSliceState, {payload}: { payload: { id: number, groupId: number | null, order: number }[] }) {
        const server = selectSelectedServer({data: state});
        if (server === undefined) return;
        const channels = server.groups.map(group => group.channels).flat().concat(server.channels);
        server.channels = [];
        server.groups = server.groups.map(group => ({...group, channels: []}));

        payload.forEach(channel => {
            const found = channels.find(ch => ch.id === channel.id);
            if (found === undefined) return;
            found.order = channel.order;
            found.groupId = channel.groupId;
            if (channel.groupId === null) {
                server.channels.push(found);
            } else {
                const group = server.groups.find(group => group.id === channel.groupId);
                if (group === undefined) return;
                group.channels.push(found);
            }
        });

    },
    addChannelUsers(state: DataSliceState, {payload}: { payload: { channelId: number, socketId: string, userId: string }[] }) {
        const channels = state.servers.map(server => server.channels.concat(server.groups.map(group => group.channels).flat()).filter(channel => channel.type === ChannelType.Voice)).flat();
        if (channels.length === 0) return;
        payload.forEach(u1 => {
            const channel = channels.find(channel => channel.id === u1.channelId) as VoiceChannel | undefined;
            if (channel === undefined) return;
            const existingUserIndex = channel.users.findIndex(user => user.userId === u1.userId);
            if (existingUserIndex === -1)
                channel.users.push({...u1, isTalking: false});
            else
                channel.users[existingUserIndex] = {...u1, isTalking: false};
        });
    },
    removeChannelUsers(state: DataSliceState, {payload}: { payload: { socketId: string, channelId: number }[] }) {
        const channels = state.servers.map(server => server.channels.concat(server.groups.map(group => group.channels).flat()).filter(channel => channel.type === ChannelType.Voice)).flat();
        payload.forEach(payload => {
            const channel = channels.find(channel => channel.id === payload.channelId) as VoiceChannel;
            if (channel === undefined) return;
            if (channel.type !== ChannelType.Voice) return;
            const userIndex = channel.users.findIndex(user => user.socketId === payload.socketId);
            if (userIndex === -1) return;
            channel.users.splice(userIndex, 1);
        });
    },
    setUserIsTalking(state: DataSliceState, {payload}: { payload: { socketId: string, isTalking: boolean } }) {
        const users = selectJoinedChannelUsers({data: state});
        const user = users.find(user => user.socketId === payload.socketId);
        if (user === undefined) return;
        user.isTalking = payload.isTalking;
    },
};

export default channelReducers;