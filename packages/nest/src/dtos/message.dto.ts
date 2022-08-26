import { ChannelMessageDocument } from "../entities/channel-message.schema";
import { FriendshipMessageDocument } from "../entities/friendship-message.schema";
import { GroupMessageDocument } from "../entities/group-message.schema";
import Message from "../entities/message.schema";
import Reaction from "../entities/reaction.schema";

export class MessageDto<T extends ReactionDto = ReactionDto> {
  id: string;
  userId: string;
  timestamp: number;
  text: string;
  replyId: string;
  reactions: T[];

  constructor(messageDocument: Message) {
    this.id = (messageDocument as any).id as string;
    this.userId = messageDocument.userId.toString();
    this.timestamp = messageDocument.timestamp;
    this.text = messageDocument.text;
    this.replyId = messageDocument.replyId?.toString();
  }
}

export class ReactionDto {
  id: string;
  userId: string;
  text: string;
  messageId: string;

  constructor(reaction: Reaction, messageId: string) {
    this.id = reaction._id.toString();
    this.userId = reaction.userId.toString();
    this.text = reaction.text;
    this.messageId = messageId;
  }
}

export class FriendshipMessageDto extends MessageDto<FriendshipMessageReactionDto> {
  friendshipId: string;

  constructor(friendshipMessageDocument: FriendshipMessageDocument) {
    super(friendshipMessageDocument);
    this.friendshipId = friendshipMessageDocument.friendshipId.toString();
    this.reactions = friendshipMessageDocument.reactions.map(
      (reaction) => new FriendshipMessageReactionDto(reaction, friendshipMessageDocument.id, this.friendshipId)
    );
  }
}

export class FriendshipMessageReactionDto extends ReactionDto {
  friendshipId: string;

  constructor(reaction: Reaction, messageId: string, friendshipId: string) {
    super(reaction, messageId);
    this.friendshipId = friendshipId;
  }
}

export class GroupMessageDto extends MessageDto<GroupMessageReactionDto> {
  groupId: string;

  constructor(groupMessageDocument: GroupMessageDocument) {
    super(groupMessageDocument);
    this.groupId = groupMessageDocument.groupId.toString();
    this.reactions = groupMessageDocument.reactions.map((reaction) => new GroupMessageReactionDto(reaction, groupMessageDocument.id, this.groupId));
  }
}

export class GroupMessageReactionDto extends ReactionDto {
  groupId: string;

  constructor(reaction: Reaction, messageId: string, groupId: string) {
    super(reaction, messageId);
    this.groupId = groupId;
  }
}

export class ChannelMessageDto extends MessageDto<ChannelMessageReactionDto> {
  serverId: string;
  groupId: string;
  channelId: string;

  constructor(channelMessageDocument: ChannelMessageDocument, serverId: string, groupId: string) {
    super(channelMessageDocument);
    this.serverId = serverId;
    this.groupId = groupId;
    this.channelId = channelMessageDocument.channelId.toString();
    this.reactions = channelMessageDocument.reactions.map(
      (reaction) => new ChannelMessageReactionDto(reaction, this.serverId, this.groupId, this.channelId, this.id)
    );
  }
}

export class ChannelMessageReactionDto extends ReactionDto {
  serverId: string;
  groupId: string;
  channelId: string;

  constructor(reaction: Reaction, serverId: string, groupId: string, channelId: string, messageId: string) {
    super(reaction, messageId);
    this.serverId = serverId;
    this.groupId = groupId;
    this.channelId = channelId;
  }
}
