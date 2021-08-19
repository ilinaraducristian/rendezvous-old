import {DataSliceState} from "state-management/slices/data/data.slice";
import User from "types/User";
import Channel, {ChannelType, VoiceChannel} from "types/Channel";
import Server from "types/Server";

export const selectIsBackendInitialized = ({data}: { data: DataSliceState }): boolean => data.isBackendInitialized;

export const selectSelectedChannel = ({data}: { data: DataSliceState }): Channel | undefined =>
    data.servers.map(server => server.channels.concat(server.groups.map(group => group.channels).flat()))
        .flat()
        .find(channel => channel.id === data.selectedChannel)
;

export const selectSelectedServer = ({data}: { data: DataSliceState }): Server | undefined =>
    data.servers.find(server => server.id === data.selectedServer)
;

export const selectOverlay = ({data}: { data: DataSliceState }): { type: string; payload: any; } | null => data.overlay;

export const selectUsers = ({data}: { data: DataSliceState }): User[] => data.users;

export const selectJoinedChannel = ({data}: { data: DataSliceState }): VoiceChannel | null => {
  const joinedVoiceChannel = data.joinedVoiceChannel;
  if (joinedVoiceChannel === null) return null;
  const server = data.servers.find(server => server.id === joinedVoiceChannel.serverId);
  if (server === undefined) return null;
  if (joinedVoiceChannel.groupId === null) {
    const foundChannel = server.channels.find(channel => channel.id === joinedVoiceChannel.channelId && channel.type === ChannelType.Voice);
    if (foundChannel === undefined) return null;
    return foundChannel as VoiceChannel;
  } else {
    const foundGroup = server.groups.find(group => group.id === joinedVoiceChannel.groupId);
    if (foundGroup === undefined) return null;
    const foundChannel = server.channels.find(channel => channel.id === joinedVoiceChannel.channelId && channel.type === ChannelType.Voice);
    if (foundChannel === undefined) return null;
    return foundChannel as VoiceChannel;
  }
};

export const selectServers = ({data}: { data: DataSliceState }): Server[] => data.servers;