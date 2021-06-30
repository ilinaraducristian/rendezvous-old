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
  name: string
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

export type Users = Map<string, User>;

export type ServersData = {
  servers: SortedMap<Server>,
  channels: SortedMap<Channel>,
  groups: SortedMap<Group>,
  members: SortedMap<Member>,
  users: Users
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
  users: Users,
  selectedServer: Server | null,
  selectedChannel: Channel | null,
  overlay: any
}

export type GlobalContextType = {
  state: GlobalStatesType, dispatch: Dispatch<Action>
}