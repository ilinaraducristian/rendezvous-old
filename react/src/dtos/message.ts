import ReactionDto from "./reaction";

type MessageDto = {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  files: string[];
  reactions: ReactionDto[];
};

export type ChannelMessageDto = MessageDto & {
  serverId: string;
  groupId: string;
  channelId: string;
};

export type FriendshipMessageDto = MessageDto & {
  friendshipId: string;
};

export default MessageDto;
