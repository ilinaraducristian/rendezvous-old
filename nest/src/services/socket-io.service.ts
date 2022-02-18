import { Injectable } from "@nestjs/common";
import { Server as SocketIoServer } from "socket.io";
import { ChannelIds, ChannelMessageIds, GroupIds, MemberIds } from "src/dtos/common-ids";
import Friendship from "src/dtos/friendship";
import FriendshipStatus from "src/dtos/friendship-status";
import Reaction from "src/dtos/reaction";
import { ChannelMessage, FriendshipMessage } from "src/entities/message";
import Channel from "../dtos/channel";
import Group from "../dtos/group";
import Member from "../dtos/member";
import Server from "../dtos/server";
import SocketIoServerEvents from "../dtos/SocketIoServerEvents";

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

  newMember(serverId: string, member: Member) {
    this.emitToServer(member.serverId, SocketIoServerEvents.newMember, serverId, member);
  }

  serverUpdate(serverId: string, payload: Partial<Server>) {
    this.emitToServer(serverId, SocketIoServerEvents.serverUpdate, payload);
  }

  serverDeleted(serverId: string) {
    this.emitToServer(serverId, SocketIoServerEvents.serverDeleted, serverId);
  }

  newGroup(serverId: string, group: Group) {
    this.emitToServer(serverId, SocketIoServerEvents.newGroup, serverId, group);
  }

  newChannel(ids: GroupIds, channel: Channel) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.newChannel, ids, channel);
  }

  newChannelMessage(ids: ChannelIds, message: ChannelMessage) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.newChannelMessage, ids, message);
  }

  newChannelMessageReaction(ids: ChannelMessageIds, message: Reaction) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.newChannelMessageReaction, ids, message);
  }

  channelUpdate(serverId: string, payload: Partial<Channel> & Pick<Channel, "id">) {
    this.emitToServer(serverId, SocketIoServerEvents.channelUpdate, payload);
  }

  channelDeleted(ids: ChannelIds, channels: Pick<Channel, "id" | "order">[]) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.channelDeleted, ids, channels);
  }

  groupUpdated(serverId: string, payload: Partial<Group> & Pick<Group, "id">) {
    this.emitToServer(serverId, SocketIoServerEvents.groupUpdate, payload);
  }

  memberLeft(ids: MemberIds) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.memberLeft, ids);
  }

  groupDeleted(ids: GroupIds, groups: Pick<Group, "id" | "order">[]) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.groupDeleted, ids, groups);
  }

  channelMessageDeleted(ids: ChannelMessageIds) {
    this.emitToServer(ids.serverId, SocketIoServerEvents.channelMessageDeleted, ids);
  }

  newFriendship(userId: string, friendship: Friendship) {
    this.emitToUser(userId, SocketIoServerEvents.newFriendship, friendship);
  }

  newFriendshipMessage(friendshipId: string, friendshipUser1Id: string, friendshipUser2Id: string, message: FriendshipMessage) {
    this.emitToUser(friendshipUser1Id, SocketIoServerEvents.newFriendshipMessage, friendshipId, message);
    this.emitToUser(friendshipUser2Id, SocketIoServerEvents.newFriendshipMessage, friendshipId, message);
  }

  friendshipUpdate(userId: string, friendshipId: string, friendshipStatus: FriendshipStatus) {
    this.emitToUser(userId, SocketIoServerEvents.friendshipUpdate, friendshipId, friendshipStatus);
  }

  friendshipDeleted(userId: string, friendshipId: string) {
    this.emitToUser(userId, SocketIoServerEvents.friendshipDeleted, friendshipId);
  }

  private emitToUser(userId: string, event: SocketIoServerEvents, ...payloads: any[]) {
    const socket = Array.from(this.socketIoServer.of("/").sockets).find((socket) => socket[1].handshake.auth.userId === userId);
    if (socket === undefined) return;
    this.socketIoServer.to(socket[0]).emit(event, ...payloads);
  }

  private emitToServer(id: string, event: SocketIoServerEvents, ...payloads: any[]) {
    this.socketIoServer.to(id).emit(event, ...payloads);
  }
}
