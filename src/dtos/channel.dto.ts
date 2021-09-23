import {Message} from './message.dto';

export enum ChannelType {
  Text = 'text',
  Voice = 'voice'
}

export type Channel = {
  id: number,
  serverId: number,
  groupId: number | null,
  type: ChannelType,
  name: string,
  order: number
}

export type VoiceChannelUser = {
  socketId: string, userId: string, isTalking: boolean
}

export type VoiceChannel = Channel & {
  users: VoiceChannelUser[],
}

export type TextChannel = Channel & {
  messages: Message[]
}

export type JoinVoiceChannelRequest = {
  serverId: number,
  channelId: number,
}

export type JoinVoiceChannelResponse = {
  channelId: number,
  socketId: string,
  userId: string
}[]

export type NewChannelRequest = {
  serverId: number,
  groupId: number | null,
  channelName: string
}

export type NewChannelResponse = {
  channelId: number
}

export type MoveChannelRequest = {
  serverId: number,
  channelId: number,
  groupId: number | null,
  order: number
}

export type MoveChannelResponse = {
  channels: { id: number, groupId: number | null, order: number }[]
}