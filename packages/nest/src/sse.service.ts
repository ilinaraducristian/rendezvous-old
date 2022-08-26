import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { Subject } from "rxjs";
import { ChannelMessageDto, FriendshipMessageDto, GroupMessageDto } from "./dtos/message.dto";
import { ChannelDto, GroupDto } from "./dtos/server.dto";
import { FriendshipDto } from "./friendship/friendship.dto";
import MessageEvent from "./message-event";
import SseEvents from "./sse-events";

type MessageType = MessageEvent & { userId?: Types.ObjectId; groupId?: Types.ObjectId; serverId?: Types.ObjectId };

@Injectable()
export class SseService {
  private readonly sse = new Subject<MessageType>();

  get sse$() {
    return this.sse.asObservable();
  }

  private next(value: MessageType) {
    this.sse.next(value);
  }

  friendRequest(userId: Types.ObjectId, data: FriendshipDto) {
    return this.next({
      type: SseEvents.friendRequest,
      userId,
      data,
    });
  }

  acceptFriendshipRequest(userId: Types.ObjectId, id: string) {
    return this.next({ type: SseEvents.friendRequestAccepted, userId, data: { id } });
  }

  deleteFriendship(userId: Types.ObjectId, id: string) {
    return this.next({ type: SseEvents.friendshipDeleted, userId, data: { id } });
  }

  friendshipMessage(userId: Types.ObjectId, data: FriendshipMessageDto) {
    return this.next({
      type: SseEvents.friendshipMessage,
      userId,
      data,
    });
  }

  deleteFriendshipMessage(userId: Types.ObjectId, friendshipId: string, id: string) {
    return this.next({ type: SseEvents.friendshipMessageDeleted, userId, data: { friendshipId, id } });
  }

  groupMessage(groupId: Types.ObjectId, data: GroupMessageDto) {
    return this.next({ type: SseEvents.groupMessage, groupId, data });
  }

  channel(serverId: Types.ObjectId, data: ChannelDto) {
    return this.next({ type: SseEvents.channel, serverId, data });
  }

  group(serverId: Types.ObjectId, data: GroupDto) {
    return this.next({ type: SseEvents.group, serverId, data });
  }

  channelMessage(serverId: Types.ObjectId, data: ChannelMessageDto) {
    return this.next({ type: SseEvents.channelMessage, serverId, data });
  }
}
