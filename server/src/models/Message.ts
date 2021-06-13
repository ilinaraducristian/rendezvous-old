export type Message = {
  id: number,
  server_id: number,
  channel_id: number,
  user_id: string,
  timestamp: string,
  text: string,
}

export default Message;