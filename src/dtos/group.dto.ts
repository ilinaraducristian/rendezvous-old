import {Channel} from "./channel.dto";

export type Group = {
  id: number,
  serverId: number,
  name: string,
  order: number,
  channels: Channel[] // channels in a group
}

export type NewGroupRequest = {
  serverId: number,
  groupName: string
}

export type MoveGroupRequest = {
  serverId: number,
  groupId: number,
  order: number
}

export type MoveGroupResponse = {
  groups: { id: number, order: number }[]
}

export type NewGroupResponse = number;
