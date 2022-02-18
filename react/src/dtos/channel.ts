type ChannelDto = {
  id: string;
  serverId: string;
  groupId: string;
  name: string;
  order: number;
  type: ChannelType;
};

export enum ChannelType {
  text,
  voice,
}

export default ChannelDto;
