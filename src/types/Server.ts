import Channel from "types/Channel";
import Group from "types/Group";
import Member from "types/Member";
import User from "types/User";

type Server = {
  id: number,
  name: string,
  userId: string,
  invitation: string | null,
  invitationExp: Date | null,
  channels: Channel[], // channel without a group
  groups: Group[],
  members: Member[],
}

export type servers = {
  servers: Server[],
  users: User[]
}

export type Processedservers = {
  servers: Server[],
  users: User[]
}

export default Server;