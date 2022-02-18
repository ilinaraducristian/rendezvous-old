import Reaction from "./reaction";

type Message = {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  files: string[];
  reactions: Reaction[];
};

export type ChannelMessage = Message & {
  channelId: string;
};

export type FriendshipMessage = Message & {
  friendshipId: string;
};

export default Message;
