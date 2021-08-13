import Channel from "./Channel";
import Group from "./Group";
import Member from "./Member";
import User from "./User";

type Server = {
  id: number,
  name: string,
  userId: string,
  invitation: string | null,
  invitationExp: Date | null,
  channels: Channel[], // channels without a group
  groups: Group[],
  members: Member[],
}

export type ServersData = {
  servers: Server[],
  users: User[]
}

export type ProcessedServersData = {
  servers: Server[],
  users: User[]
}

export default Server;