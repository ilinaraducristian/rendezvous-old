import { Injectable } from "@nestjs/common";
import {
    ChannelDto,
    ChannelIds,
    ChannelMessageIds,
    FriendshipDto,
    FriendshipStatusDto,
    GroupDto,
    GroupIds,
    MemberDto,
    MemberIds,
    ReactionDto,
    ServerDto,
    SocketIoServerEvents
} from "@rendezvous/common";
import { Server as SocketIoServer } from "socket.io";
import { ChannelMessage, FriendshipMessage } from "src/entities/message";

@Injectable()
export class SocketIoService {
  socketIoServer: SocketIoServer;

  async joinServer(userId: string, serverId: string) {
    const client = await Array.from(this.socketIoServer.sockets.sockets).find(([_, socket]) => socket.handshake.auth.userId === userId)[1];
    await client.join(serverId);
  }

  async leaveServer(userId: string, serverId: string) {
    const client = await Array.from(this.socketIoServer.sockets.sockets).find(([_, socket]) => socket.handshake.auth.userId === userId)[1];
    await client.leave(serverId);
  }

  newMember(serverId: string, member: MemberDto) {
    this.emitToServer(member.serverId, SocketIoServerEvents.newMember, serverId, member);
  }

  serverUpdate(serverId: string, payload: Partial<ServerDto>) {
    this.emitToServer(serverId, SocketIoServerEvents.serverUpdate, payload);
  }

  serverDeleted(serverId: string) {
    this.emitToServer(serverId, SocketIoServerEvents.serverDeleted, serverId);
  }

  newGroup(serverId: string, group: GroupDto) {
    this.emitToServer(serverId, SocketIoServerEvents.newGroup, serverId, group);
  }

  newChannel(ids: GroupIds, channel: ChannelDto) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.newChannel, ids, channel);
  }

  newChannelMessage(ids: ChannelIds, message: ChannelMessage) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.newChannelMessage, ids, message);
  }

  newChannelMessageReaction(ids: ChannelMessageIds, message: ReactionDto) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.newChannelMessageReaction, ids, message);
  }

  channelUpdate(serverId: string, payload: Partial<ChannelDto> & Pick<ChannelDto, "id">) {
    this.emitToServer(serverId, SocketIoServerEvents.channelUpdate, payload);
  }

  channelDeleted(ids: ChannelIds, channels: Pick<ChannelDto, "id" | "order">[]) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.channelDeleted, ids, channels);
  }

  groupUpdated(serverId: string, payload: Partial<GroupDto> & Pick<GroupDto, "id">) {
    this.emitToServer(serverId, SocketIoServerEvents.groupUpdate, payload);
  }

  memberLeft(ids: MemberIds) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.memberLeft, ids);
  }

  groupDeleted(ids: GroupIds, groups: Pick<GroupDto, "id" | "order">[]) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.groupDeleted, ids, groups);
  }

  channelMessageDeleted(ids: ChannelMessageIds) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.channelMessageDeleted, ids);
  }

  newFriendship(userId: string, friendship: FriendshipDto) {
    this.emitToUser(userId, SocketIoServerEvents.newFriendship, friendship);
  }

  newFriendshipMessage(friendshipId: string, friendshipUser1Id: string, friendshipUser2Id: string, message: FriendshipMessage) {
    this.emitToUser(friendshipUser1Id, SocketIoServerEvents.newFriendshipMessage, friendshipId, message);
    this.emitToUser(friendshipUser2Id, SocketIoServerEvents.newFriendshipMessage, friendshipId, message);
  }

  friendshipUpdate(userId: string, friendshipId: string, friendshipStatus: FriendshipStatusDto) {
    this.emitToUser(userId, SocketIoServerEvents.friendshipUpdate, friendshipId, friendshipStatus);
  }

  friendshipDeleted(userId: string, friendshipId: string) {
    this.emitToUser(userId, SocketIoServerEvents.friendshipDeleted, friendshipId);
  }

  newVoiceChannelUser(channelIds: ChannelIds, userId: string) {
    this.emitToServer(channelIds.serverId, SocketIoServerEvents.newVoiceChannelUser, channelIds, userId);
  }

  voiceChannelUserRemoved(channelIds: ChannelIds, userId: string) {
    this.emitToServer(channelIds.serverId, SocketIoServerEvents.newVoiceChannelUser, channelIds, userId);
  }

  private emitToUser(userId: string, event: SocketIoServerEvents, ...payloads: any[]) {
    const socket = Array.from(this.socketIoServer.of("/").sockets).find((socket) => socket[1].handshake.auth.userId === userId);
    if (socket === undefined) return;
    this.socketIoServer.to(socket[0]).emit(event, ...payloads);
  }

  private emitToServer(serverId: string, event: SocketIoServerEvents, ...payloads: any[]) {
    this.socketIoServer.to(serverId).emit(event, ...payloads);
  }
}
