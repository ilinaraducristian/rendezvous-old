export type User = {
  id: string,
  username: string,
  firstName: string,
  lastName: string
}

export type Group = {
  id: number,
  serverId: number,
  name: string,
  channels: Channel[]
}

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

export type Channel = {
  id: number,
  serverId: number,
  groupId: number | null,
  type: ChannelType,
  name: string,
  order: number,
}

export type Message = {
  id: number,
  serverId: number,
  channelId: number,
  userId: string,
  timestamp: string,
  text: string,
}

export type Member = {
  id: number,
  serverId: number,
  userId: string,
}

export type Server = {
  id: number,
  name: string,
  userId: string,
  invitation: string | null,
  invitationExp: Date | null,
  channels: Channel[], // channels without a group
  groups: Group[],
  members: Member[],
}

export class UsersMap extends Map<string, User> {

  constructor(entries?: readonly (readonly [string, User])[] | Map<string, User> | null) {
    super();
    if (entries === undefined || null) return;
    if (entries instanceof Array) {
      entries.forEach(value => {
        this.set(value[0], value[1]);
      });
    } else if (entries instanceof Map) {
      entries.forEach((value, key) => {
        this.set(key, value);
      });
    }
  }

  clone() {
    const newMap = new Map<string, User>();
    this.forEach((value, key) => newMap.set(key, value));
    return newMap;
  }

}

export type ServersData = {
  servers: Server[],
  users: User[]
}

export type ProcessedServersData = {
  servers: Server[],
  users: User[]
}