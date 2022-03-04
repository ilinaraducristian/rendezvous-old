import {
  ChannelDto,
  ChannelMessageDto,
  FriendshipDto,
  FriendshipMessageDto,
  FriendshipStatusDto,
  GroupDto,
  MemberDto,
  ReactionDto,
  SocketIoServerEvents,
} from "@rendezvous/common";
import { io } from "socket.io-client";
import {
  ChannelIds,
  ChannelMessageIds,
  ChannelMessageReactionIds,
  FriendshipMessageIds,
  FriendshipMessageReactionIds,
  GroupIds,
  MemberIds,
} from "./common-ids";
import config from "./config";
import Channel from "./entities/channel";
import Friendship from "./entities/friendship";
import Group from "./entities/group";
import Member from "./entities/member";
import { ChannelMessage, FriendshipMessage } from "./entities/message";
import Reaction from "./entities/reaction";
import friendshipsState from "./state/friendships-state";
import serversState from "./state/servers-state";

const socketio = io(config.socketioURL, { autoConnect: false });

socketio.on(SocketIoServerEvents.newGroup, (serverId: string, groupDto: GroupDto) => {
  serversState.servers.get(serverId)?.addGroup(groupDto.id, new Group(groupDto));
});

socketio.on(SocketIoServerEvents.newChannel, (ids: GroupIds, channelDto: ChannelDto) => {
  serversState.servers.get(ids.serverId)?.groups.get(ids.groupId)?.addChannel(channelDto.id, new Channel(channelDto));
});

socketio.on(SocketIoServerEvents.newChannelMessage, (ids: ChannelIds, messageDto: ChannelMessageDto) => {
  serversState.servers.get(ids.serverId)?.groups.get(ids.groupId)?.channels.get(ids.channelId)?.addMessage(new ChannelMessage(messageDto));
});

socketio.on(SocketIoServerEvents.newChannelMessageReaction, (ids: ChannelMessageIds, reactionDto: ReactionDto) => {});

socketio.on(SocketIoServerEvents.newMember, (serverId: string, memberDto: MemberDto) => {
  serversState.servers.get(serverId)?.addMember(memberDto.id, new Member(memberDto));
});

socketio.on(SocketIoServerEvents.serverDeleted, (serverId: string) => {
  serversState.removeServer(serverId);
});

socketio.on(SocketIoServerEvents.memberLeft, (ids: MemberIds) => {
  serversState.servers.get(ids.serverId)?.removeMember(ids.memberId);
});

socketio.on(SocketIoServerEvents.groupDeleted, (ids: GroupIds, groups: Pick<GroupDto, "id" | "order">[]) => {
  const server = serversState.servers.get(ids.serverId);
  if (server === undefined) return;
  const serverGroups = server.groups;
  groups.forEach((group) => {
    const _group = serverGroups.get(group.id);
    if (_group === undefined) return;
    _group.order = group.order;
  });
  server.removeGroup(ids.groupId);
});

socketio.on(SocketIoServerEvents.channelDeleted, (ids: ChannelIds, channels: Pick<ChannelDto, "id" | "order">[]) => {
  const group = serversState.servers.get(ids.serverId)?.groups.get(ids.groupId);
  if (group === undefined) return;
  const groupChannels = group.channels;
  channels.forEach((channel) => {
    const _channel = groupChannels.get(channel.id);
    if (_channel === undefined) return;
    _channel.order = channel.order;
  });
  group.removeChannel(ids.channelId);
});

socketio.on(SocketIoServerEvents.channelMessageDeleted, (ids: ChannelMessageIds) => {
  const channel = serversState.servers.get(ids.serverId)?.groups.get(ids.groupId)?.channels.get(ids.channelId);
  if (channel === undefined) return;
  channel.messages.delete(ids.messageId);
});

socketio.on(SocketIoServerEvents.channelMessageReactionDeleted, (ids: ChannelMessageReactionIds) => {
  const message = serversState.servers.get(ids.serverId)?.groups.get(ids.groupId)?.channels.get(ids.channelId)?.messages.get(ids.messageId);
  if (message === undefined) return;
});

socketio.on(SocketIoServerEvents.newFriendshipMessage, (friendshipId: string, messageDto: FriendshipMessageDto) => {
  friendshipsState.friendships.get(friendshipId)?.addMessage(new FriendshipMessage(messageDto));
});

socketio.on(SocketIoServerEvents.newFriendshipMessageReaction, (ids: FriendshipMessageIds, reactionDto: ReactionDto) => {
  friendshipsState.friendships.get(ids.friendshipId)?.messages.get(ids.messageId)?.reactions.set(reactionDto.id, new Reaction(reactionDto));
});

socketio.on(SocketIoServerEvents.friendshipMessageDeleted, (ids: FriendshipMessageIds) => {
  friendshipsState.friendships.get(ids.friendshipId)?.messages.delete(ids.messageId);
});

socketio.on(SocketIoServerEvents.friendshipMessageReactionDeleted, (ids: FriendshipMessageReactionIds) => {
  friendshipsState.friendships.get(ids.friendshipId)?.messages.get(ids.messageId)?.reactions.delete(ids.messageId);
});

socketio.on(SocketIoServerEvents.newFriendship, (friendshipDto: FriendshipDto) => {
  friendshipsState.friendships.set(friendshipDto.id, new Friendship(friendshipDto));
});

socketio.on(SocketIoServerEvents.friendshipUpdate, (id: string, status: FriendshipStatusDto) => {
  const friendship = friendshipsState.friendships.get(id);
  if (friendship === undefined) return;
  friendship.status = status;
});

socketio.on(SocketIoServerEvents.friendshipDeleted, (id: string) => {
  friendshipsState.friendships.delete(id);
});

socketio.on(SocketIoServerEvents.newVoiceChannelUser, (channelIds: ChannelIds, userId: string) => {
  serversState.servers.get(channelIds.serverId)?.groups.get(channelIds.groupId)?.channels.get(channelIds.channelId)?.users?.push(userId);
});

export default socketio;
