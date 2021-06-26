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
  server_id: number,
  name: string,
  order: number,
}

export enum ChannelType {
  Text = "text",
  Voice = "voice"
}

export type Channel = {
  id: number,
  server_id: number,
  group_id: number,
  type: ChannelType,
  name: string,
  order: number,
}

export type Message = {
  id: number,
  server_id: number,
  channel_id: number,
  user_id: string,
  timestamp: Date,
  text: string,
}

export type Member = {
  id: number,
  server_id: number,
  user_id: string,
}

export type Server = {
  id: number,
  name: string,
  user_id: string,
  invitation: string | null,
  invitation_exp: Date | null,
  order: number
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
  users: Map<string, User>,
  selectedServer: Server | null,
  selectedChannel: Channel | null,
  overlay: any
}

export type GlobalContextType = {
  state: GlobalStatesType, dispatch: Dispatch<Action>
}