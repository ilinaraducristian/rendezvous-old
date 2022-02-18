import Channel from "./channel";

type Group = {
  id: string;
  serverId: string;
  name: string;
  order: number;
  channels: Channel[];
};

export default Group;
