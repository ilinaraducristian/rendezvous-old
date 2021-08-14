type Message = {
  id: number,
  serverId: number,
  channelId: number,
  userId: string,
  timestamp: string,
  text: string,
  isReply: boolean,
  replyId: number | null
}

export default Message;