import {Dispatch} from "react";
import SortedMap from "./util/SortedMap";

export type User = {
  id: string,
  username: string,
  firstName: string,
  lastName: string
}

export type Group = {
  id: number,
  serverId: number,
  name: string
}

export enum ChannelType {
  Text = "text",
  Voice = "voice"
}

export type Channel = {
  id: number,
  serverId: number,
  groupId: number,
  type: ChannelType,
  name: string,
  order: number
}

export type Message = {
  id: number,
  serverId: number,
  channelId: number,
  userId: string,
  timestamp: Date,
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
  invitationExp: Date | null
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
  servers: [number, Server][],
  channels: [number, Channel][],
  groups: [number, Group][],
  members: [number, Member][],
  users: [string, User][]
}

export type ProcessedServersData = {
  servers: SortedMap<Server>,
  channels: SortedMap<Channel>,
  groups: SortedMap<Group>,
  members: SortedMap<Member>,
  users: UsersMap
}

export type Action = {
  type: string,
  payload?: any | ((oldState: any) => any)
}

export type GlobalStatesType = {
  servers: SortedMap<Server>,
  channels: SortedMap<Channel>,
  groups: SortedMap<Group>,
  messages: SortedMap<Message>,
  members: SortedMap<Member>,
  users: UsersMap,
  selectedServer: Server | null,
  selectedChannel: Channel | null,
  overlay: any
}

export type GlobalContextType = {
  state: GlobalStatesType, dispatch: Dispatch<Action>
}