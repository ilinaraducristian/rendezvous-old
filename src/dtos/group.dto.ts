import {Channel} from './channel.dto';

export type Group = {
  id: number,
  serverId: number,
  name: string,
  channels: Channel[] // channels in a group
}

export type NewGroupRequest = {
  serverId: number,
  groupName: string
}

export type NewGroupResponse = number;
