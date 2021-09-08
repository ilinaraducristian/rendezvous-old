import {DataSliceState} from "state-management/slices/data/data.slice";
import {Channel, ChannelType, VoiceChannel} from "../../dtos/channel.dto";
import {Server} from "../../dtos/server.dto";
import {FriendRequest, Friendship} from "../../dtos/friend.dto";
import {User} from "../../dtos/user.dto";
import {Message} from "../../dtos/message.dto";

export const selectIsBackendInitialized = ({data}: { data: DataSliceState }): boolean => data.isBackendInitialized;

export const selectSelectedChannel = ({data}: { data: DataSliceState }): Channel | undefined =>
    data.servers.map(server => server.channels.concat(server.groups.map(group => group.channels).flat()))
        .flat()
        .find(channel => channel.id === data.selectedChannel)
;

export const selectSelectedServer = ({data}: { data: DataSliceState }): Server | undefined =>
    data.servers.find(server => server.id === data.selectedServer)
;

export const selectFriendships = ({data}: { data: DataSliceState }): Friendship[] => data.friendships;

export const selectOverlay = ({data}: { data: DataSliceState }): { type: number; payload: any; } | null => data.overlay;

export const selectUsers = ({data}: { data: DataSliceState }): User[] => data.users;

export const selectSelectedFriendshipMessages = ({data}: { data: DataSliceState }): Message[] => {
  if (data.selectedFriendship === null) return [];
  const friendship = selectSelectedFriendship({data});
  if (friendship === undefined) return [];
  return friendship.messages;
};

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
    const foundChannel = foundGroup.channels.find(channel => channel.id === joinedVoiceChannel.channelId && channel.type === ChannelType.Voice);
    if (foundChannel === undefined) return null;
    return foundChannel as VoiceChannel;
  }
};

export const selectServers = ({data}: { data: DataSliceState }): Server[] => data.servers;

export const selectFriendRequests = ({data}: { data: DataSliceState }): FriendRequest[] => data.friendRequests;

export const selectSelectedFriendship = ({data}: { data: DataSliceState }): Friendship | undefined => data.friendships.find(friendship => friendship.id === data.selectedFriendship);
export const selectSecondPanelHeader = ({data}: { data: DataSliceState }): number => data.secondPanelHeader;
export const selectSecondPanelBody = ({data}: { data: DataSliceState }): number => data.secondPanelBody;
export const selectSecondPanelFooter = ({data}: { data: DataSliceState }): number => data.secondPanelFooter;
export const selectHeader = ({data}: { data: DataSliceState }): number => data.header;
export const selectThirdPanel = ({data}: { data: DataSliceState }): number => data.thirdPanel;

export const selectIsSettingsShown = ({data}: { data: DataSliceState }): boolean => data.isSettingsShown;