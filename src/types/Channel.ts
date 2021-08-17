import Message from "types/Message";

export enum ChannelType {
  Text = "text",
  Voice = "voice"
}

export type VoiceChannel = Channel & {
  users: { socketId: string, userId: string }[]
}

export type TextChannel = Channel & {
  messages: Message[]
}

type Channel = {
  id: number,
  serverId: number,
  groupId: number | null,
  type: ChannelType,
  name: string,
  order: number,
}

export default Channel;