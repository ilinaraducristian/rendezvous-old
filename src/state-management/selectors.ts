import Server from "../types/Server";
import Channel, {ChannelType, TextChannel} from "../types/Channel";
import Group from "../types/Group";
import Member from "../types/Member";
import Message from "../types/Message";
import User from "../types/User";
import {State} from "./slices/serversSlice";

export const selectServers = ({servers}: { servers: State }): Server[] => servers.servers;
export const selectChannels = (channels: { serverId: number, groupId: number | null, channelId: number }[]) =>
    ({servers}: { servers: State }): Channel[] => {
      return channels.map(channel => {
        const server = servers.servers.find(server => server.id === channel.serverId);
        if (server === undefined) return;
        if (channel.groupId === null) {
          return server.channels.find(ch => ch.id === channel.channelId);
        } else {
          return server.groups.find(group => group.id === channel.groupId)?.channels.find(ch => ch.id === channel.channelId);
        }
      }).filter(channel => channel !== undefined) as Channel[];
    };
export const selectSelectedServerChannels = (groupId: number | null) => ({servers}: { servers: State }): Channel[] | undefined => {
  if (servers.selectedServer === undefined) return;
  const server = servers.servers.find(server => server.id === servers.selectedServer);
  return groupId === null ?
      server?.channels :
      server?.groups.find(group => group.id === groupId)?.channels;
};
export const selectGroups = ({servers}: { servers: State }): Group[] | undefined => {
  return servers.servers.find(server => server.id === servers.selectedServer)?.groups;
};
export const selectMembers = ({servers}: { servers: State }): Member[] | undefined => {
  return servers.servers.find(server => server.id === servers.selectedServer)?.members;
};
export const selectMessages = ({servers}: { servers: State }): Message[] | undefined => {
  const server = servers.servers.find(server => server.id === servers.selectedServer);
  const channel = server?.channels.concat(server?.groups.map(group => group.channels).flat())
      .find(channel => channel.id === servers.selectedChannel && channel.type === ChannelType.Text);
  return (channel as TextChannel | undefined)?.messages;
};
export const selectUsers = ({servers}: { servers: State }): User[] => servers.users;
export const selectSelectedServer = ({servers}: { servers: State }): Server | undefined => {
  return servers.selectedServer === null ? undefined : servers.servers.find(server => server.id === servers.selectedServer);
};
export const selectSelectedChannel = ({servers}: { servers: State }): Channel | undefined => {
  const server = servers.servers.find(server => server.id === servers.selectedServer);
  return server?.channels.concat(server?.groups.map(group => group.channels).flat())
      .find(channel => channel.id === servers.selectedChannel && channel.type === ChannelType.Text);
};
export const selectInitialized = ({servers}: { servers: State }): boolean => servers.backendInitialized;
export const selectOverlay = ({servers}: { servers: State }): { type: string, payload: any } | null => servers.overlay;

export const selectJoinedChannel = ({servers}: { servers: State }): { serverId: number, groupId: number | null, channelId: number } | null => servers.joinedVoiceChannel;