import Channel from "types/Channel";

type Group = {
  id: number,
  serverId: number,
  name: string,
  channels: Channel[]
}

export default Group;