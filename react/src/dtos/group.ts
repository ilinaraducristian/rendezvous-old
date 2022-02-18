import ChannelDto from "./channel";

type GroupDto = {
  id: string;
  serverId: string;
  name: string;
  order: number;
  channels: ChannelDto[];
};

export default GroupDto;
