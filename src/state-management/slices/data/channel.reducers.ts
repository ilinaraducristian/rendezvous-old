import {DataSliceState} from "state-management/slices/data/data.slice";
import {ChannelType, TextChannel, VoiceChannel} from "../../../dtos/channel.dto";

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
            (message.replyId = null)
        );
    channel.messages.splice(messageIndex, 1);
  },
  setJoinedVoiceChannel(state: DataSliceState, {payload}: { payload: { serverId: number, groupId: number | null, channelId: number } | null }) {
    state.joinedVoiceChannel = payload;
  },
  joinVoiceChannel(state: DataSliceState, {payload}: { payload: { serverId: number, groupId: number | null, channelId: number } }) {
    state.joinedVoiceChannel = payload;
  },
  leaveVoiceChannel(state: DataSliceState) {
    state.joinedVoiceChannel = null;
  },
  addChannelUsers(state: DataSliceState, {payload}: { payload: { channelId: number, socketId: string, userId: string }[] }) {
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
};

export default channelReducers;