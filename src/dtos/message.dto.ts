export type Message = {
  id: number,
  friendshipId: number | null,
  serverId: number | null,
  channelId: number | null,
  userId: string,
  timestamp: string,
  text: string,
  isReply: boolean,
  replyId: number | null,
  imageMd5: string | null,
}

export type NewMessageResponse = Message;

export type NewMessageRequest =
    Omit<Message, 'id' | 'serverId' | 'userId' | 'timestamp' | "imageMd5">
    & { image: string | null };

export type GetMessagesRequest = {
  friendshipId: number | null,
  serverId: number | null,
  channelId: number | null,
  offset: number
}

export type EditMessagesRequest = {
  serverId: number,
  channelId: number,
  messageId: number,
  text: string
}
export type DeleteMessagesRequest = {
  serverId: number,
  channelId: number,
  messageId: number
}
