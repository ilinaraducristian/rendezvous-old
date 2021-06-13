import Member from "./Member";
import Channel from "./Channel";
import Group from "./Group";

export type Server = {
  id: number,
  name: string,
  owner: string,
  invitation: string,
  invitation_exp: Date,
  groups: Map<number, Group>,
  channels: Map<number, Channel>,
  members: Map<number, Member>
}

export default Server;