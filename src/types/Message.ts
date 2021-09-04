type Message = {
    id: number,
    friendshipIdId: number | null,
    serverId: number | null,
    channelId: number | null,
    userId: string,
    timestamp: string,
    text: string,
    isReply: boolean,
    replyId: number | null,
    image: string | null
}

export default Message;