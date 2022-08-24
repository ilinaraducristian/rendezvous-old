import { ChannelMessageDocument } from "../entities/channel-message.schema";
import { FriendshipMessageDocument } from "../entities/friendship-message.schema";
import { GroupMessageDocument } from "../entities/group-message.schema";
import Message from "../entities/message.schema";

export class MessageDto {
  userId: string;
  timestamp: number;
  text: string;

  constructor(messageDocument: Message) {
    this.userId = messageDocument.userId.toString();
    this.timestamp = messageDocument.timestamp;
    this.text = messageDocument.text;
  }

}

export class FriendshipMessageDto extends MessageDto {
  friendshipId: string;

  constructor(friendshipMessageDocument: FriendshipMessageDocument) {
    super(friendshipMessageDocument);
    this.friendshipId = friendshipMessageDocument.friendshipId.toString();
  }

}

export class GroupMessageDto extends MessageDto {
  groupId: string;

  constructor(groupMessageDocument: GroupMessageDocument) {
    super(groupMessageDocument);
    this.groupId = groupMessageDocument.groupId.toString();
  }

}

export class ChannelMessageDto extends MessageDto {
  serverId: string;
  groupId: string;
  channelId: string;

  constructor(channelMessageDocument: ChannelMessageDocument, serverId: string, groupId: string) {
    super(channelMessageDocument);
    this.serverId = serverId;
    this.groupId = groupId;
    this.channelId = channelMessageDocument.channelId.toString();
  }

}