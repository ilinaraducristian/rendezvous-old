export type NewMessageResponse = {
    id: number,
    friendshipId: number | null,
    serverId: number | null,
    channelId: number | null,
    userId: string,
    timestamp: string,
    text: string,
    isReply: boolean,
    replyId: number | null,
    image: string | null,
}

export type NewMessageRequest = Omit<NewMessageResponse, 'id' | 'serverId' | 'userId' | 'timestamp'>;

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
