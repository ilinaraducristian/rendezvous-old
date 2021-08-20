import {DataSliceState} from "state-management/slices/data/data.slice";
import Channel, {ChannelType, TextChannel, VoiceChannelUser} from "types/Channel";
import Server from "types/Server";
import Message from "types/Message";
import {selectJoinedChannel, selectSelectedServer} from "state-management/selectors/data.selector";

export const selectChannels = (payload: { serverId: number, groupId: number | null, channelId: number }[]) =>
    ({data}: { data: DataSliceState }): Channel[] => {
      const foundChannels: Channel[] = [];
      payload.forEach(requestedChannel => {
        const foundServer = data.servers.find(server => server.id === requestedChannel.serverId);
        if (foundServer === undefined) return;
        addChannel(requestedChannel, foundServer, foundChannels);
      });
      return foundChannels;
    };

export const selectSelectedServerChannels = (payload: { groupId: number | null, channelId: number }[]) =>
    ({data}: { data: DataSliceState }): Channel[] => {
      if (data.selectedServer === null) return [];
      const server = data.servers.find(server => server.id === data.selectedServer);
      if (server === undefined) return [];
      const foundChannels: Channel[] = [];
      payload.forEach(requestedChannel => {
        addChannel(requestedChannel, server, foundChannels);
      });
      return foundChannels;
    };

export const selectSelectedChannelMessages = ({data}: { data: DataSliceState }): Message[] => {
  if (data.selectedChannel === null) return [];
  const server = selectSelectedServer({data});
  if (server === undefined) return [];
  const foundChannel = server.channels.concat(server.groups.map(group => group.channels).flat())
      .find(channel => channel.id === data.selectedChannel && channel.type === ChannelType.Text) as TextChannel | undefined;
  if (foundChannel === undefined) return [];
  return foundChannel.messages;
};

export const selectSelectedServerChannelsByGroupId = (groupId: number | null) =>
    ({data}: { data: DataSliceState }): Channel[] => {
      if (data.selectedServer === null) return [];
      const server = data.servers.find(server => server.id === data.selectedServer);
      if (server === undefined) return [];
      if (groupId === null) {
        return server.channels;
      } else {
        const foundGroup = server.groups.find(group => group.id === groupId);
        if (foundGroup === undefined) return [];
        return foundGroup.channels;
      }
    };

export const selectJoinedChannelUsers = ({data}: { data: DataSliceState }): VoiceChannelUser[] => {
  const joinedChannel = selectJoinedChannel({data});
  if (joinedChannel === null) return [];
  return joinedChannel.users;
};

function addChannel(requestedChannel: { groupId: number | null, channelId: number }, server: Server, foundChannels: Channel[]) {
  if (requestedChannel.groupId === null) {
    const foundChannel = server.channels.find(channel => channel.id === requestedChannel.channelId);
    if (foundChannel === undefined) return;
    foundChannels.push(foundChannel);
  } else {
    const foundGroup = server.groups.find(group => group.id === requestedChannel.groupId);
    if (foundGroup === undefined) return;
    const foundChannel = foundGroup.channels.find(channel => channel.id === requestedChannel.channelId);
    if (foundChannel === undefined) return;
    foundChannels.push(foundChannel);
  }
}